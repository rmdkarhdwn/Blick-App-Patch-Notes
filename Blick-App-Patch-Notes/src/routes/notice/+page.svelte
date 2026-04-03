<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';

	type PostRow = {
		id: number;
		title: string;
		summary: string;
		created_at: string | null;
		updated_at: string | null;
		board_type: string;
		image_url?: string | null;
	};

	let { data }: { data: { initialPosts?: PostRow[] } } = $props();

	let posts = $state([] as PostRow[]);
	let title = $state('');
	let summary = $state('');
	let selectedImageFile = $state<File | null>(null);
	let imagePreviewUrl = $state('');
	let formError = $state('');
	let loadError = $state('');
	let isSubmitting = $state(false);
	let isLoggedIn = $state(false);
	let isAdmin = $state(false);
	let userName = $state('');
	let showLoginModal = $state(false);
	let loginEmail = $state('');
	let loginPassword = $state('');
	let loginError = $state('');

	// .env에 VITE_ADMIN_EMAIL이 있으면 해당 이메일만 관리자 권한 부여
	const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

	$effect(() => {
		posts = data.initialPosts ?? [];
	});

	function applyAuthSession(
		session: { user?: { email?: string; user_metadata?: { name?: string } } } | null
	) {
		const email = session?.user?.email ?? '';
		userName = session?.user?.user_metadata?.name || email || '';
		isLoggedIn = Boolean(session?.user);
		isAdmin = Boolean(session?.user && (ADMIN_EMAIL ? email.toLowerCase() === ADMIN_EMAIL : true));
	}

	onMount(() => {
		if (!isSupabaseConfigured) return;

		supabase.auth.getSession().then(({ data }) => {
			applyAuthSession(data.session);
		});

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			applyAuthSession(session);
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	});

	async function handleAuthButtonClick() {
		if (!isSupabaseConfigured) {
			loadError = 'Supabase URL/KEY가 설정되지 않아 로그인 기능을 사용할 수 없습니다.';
			return;
		}

		if (isLoggedIn) {
			const { error } = await supabase.auth.signOut();
			if (error) {
				loadError = `로그아웃 실패: ${error.message}`;
			}
			return;
		}

		loginError = '';
		showLoginModal = true;
	}

	function closeLoginModal() {
		showLoginModal = false;
		loginEmail = '';
		loginPassword = '';
		loginError = '';
	}

	async function handleLoginSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!isSupabaseConfigured) {
			loginError = 'Supabase 설정이 필요합니다.';
			return;
		}

		const email = loginEmail.trim();
		if (!email || !loginPassword.trim()) {
			loginError = '이메일과 비밀번호를 입력하세요.';
			return;
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password: loginPassword
		});

		if (error) {
			loginError = `로그인 실패: ${error.message}`;
			return;
		}

		applyAuthSession(data.session);
		closeLoginModal();
	}

	function formatDate(value: string | null) {
		return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
	}

	function getUniqueId() {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return crypto.randomUUID();
		}
		return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
	}

	function clearSelectedImage() {
		if (imagePreviewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(imagePreviewUrl);
		}
		selectedImageFile = null;
		imagePreviewUrl = '';
	}

	function setSelectedImage(file: File) {
		if (!file.type.startsWith('image/')) {
			formError = '이미지 파일만 업로드할 수 있습니다.';
			return;
		}

		formError = '';
		if (imagePreviewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(imagePreviewUrl);
		}
		selectedImageFile = file;
		imagePreviewUrl = URL.createObjectURL(file);
	}

	function handleImageFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		setSelectedImage(file);
	}

	function handleImagePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (!items) return;

		for (const item of items) {
			if (!item.type.startsWith('image/')) continue;
			const file = item.getAsFile();
			if (!file) continue;
			event.preventDefault();
			setSelectedImage(file);
			return;
		}
	}

	async function uploadSelectedImage(): Promise<string | null> {
		if (!selectedImageFile) return null;

		const fileType = selectedImageFile.type || 'image/png';
		const extByType = fileType.split('/')[1] || 'png';
		const extByName = selectedImageFile.name.split('.').pop() || extByType;
		const extension = extByName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
		const filePath = `notice/${Date.now()}-${getUniqueId()}.${extension}`;

		const { error: uploadError } = await supabase.storage
			.from('post-images')
			.upload(filePath, selectedImageFile, {
				contentType: fileType,
				upsert: false
			});

		if (uploadError) {
			throw new Error(uploadError.message);
		}

		const { data: publicData } = supabase.storage.from('post-images').getPublicUrl(filePath);
		return publicData.publicUrl;
	}

	async function fetchNoticePosts() {
		if (!isSupabaseConfigured) {
			loadError = 'Supabase 설정이 필요합니다.';
			posts = [];
			return;
		}

		const { data: nextPosts, error } = await supabase
			.from('posts')
			.select('id, title, summary, created_at, updated_at, board_type, image_url')
			.eq('board_type', 'notice')
			.order('id', { ascending: false });

		if (error) {
			loadError = `목록 조회 실패: ${error.message}`;
			return;
		}

		loadError = '';
		posts = nextPosts ?? [];
	}

	async function handleCreateNotice(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		if (!isAdmin) {
			formError = '관리자 로그인 후 작성할 수 있습니다.';
			return;
		}

		if (!title.trim() || !summary.trim()) {
			formError = '제목과 요약을 입력하세요.';
			return;
		}

		if (!isSupabaseConfigured) {
			formError = 'Supabase 설정이 필요합니다.';
			return;
		}

		isSubmitting = true;

		let imageUrl: string | null;
		try {
			imageUrl = await uploadSelectedImage();
		} catch (uploadError) {
			formError = `이미지 업로드 실패: ${uploadError instanceof Error ? uploadError.message : '알 수 없는 오류'}`;
			isSubmitting = false;
			return;
		}

		const { error } = await supabase.from('posts').insert([
			{
				title: title.trim(),
				summary: summary.trim(),
				board_type: 'notice',
				image_url: imageUrl
			}
		]);

		if (error) {
			if (error.message.includes('image_url')) {
				formError =
					'posts 테이블에 image_url 컬럼을 추가하세요. SQL: alter table posts add column if not exists image_url text;';
				isSubmitting = false;
				return;
			}
			if (error.message.includes('post-images')) {
				formError = "Supabase Storage 버킷 'post-images'를 만들고 public 권한을 확인하세요.";
				isSubmitting = false;
				return;
			}
			formError = `공지 추가 실패: ${error.message}`;
			isSubmitting = false;
			return;
		}

		title = '';
		summary = '';
		clearSelectedImage();
		isSubmitting = false;
		await fetchNoticePosts();
	}
</script>

<main class="page">
	<nav class="tabs">
		<a href={resolve('/notice')} class="tab active">공지</a>
		<a href={resolve('/patch')} class="tab">패치노트</a>
	</nav>

	<h1>공지사항</h1>

	<div class="auth-bar">
		{#if isLoggedIn}
			<span class="user-name">{userName}</span>
		{/if}
		<button class="auth-btn" type="button" onclick={handleAuthButtonClick}>
			{isLoggedIn ? '로그아웃' : '관리자 로그인'}
		</button>
	</div>

	{#if isAdmin}
		<form class="form" onsubmit={handleCreateNotice}>
			<input bind:value={title} placeholder="공지 제목" />
			<input bind:value={summary} placeholder="공지 요약" />
			<div class="image-editor" onpaste={handleImagePaste}>
				<label class="file-picker">
					이미지 파일 선택
					<input type="file" accept="image/*" onchange={handleImageFileChange} />
				</label>
				<p class="hint">또는 여기에 이미지 붙여넣기(Ctrl/Cmd + V)</p>

				{#if imagePreviewUrl}
					<div class="preview-wrap">
						<img src={imagePreviewUrl} alt="업로드 미리보기" />
						<button type="button" class="remove-image-btn" onclick={clearSelectedImage}
							>이미지 제거</button
						>
					</div>
				{/if}
			</div>
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? '추가 중...' : '공지 추가'}
			</button>
		</form>
	{:else}
		<p class="admin-help">관리자 계정으로 로그인하면 이미지 포함 공지를 작성할 수 있습니다.</p>
	{/if}

	{#if formError}
		<p class="error">{formError}</p>
	{/if}

	{#if loadError}
		<p class="error">{loadError}</p>
	{/if}

	<ul class="list">
		{#each posts as post (post.id)}
			<li>
				<a href={resolve('/post/[id]', { id: String(post.id) })}>
					{#if post.image_url}
						<img class="item-image" src={post.image_url} alt={post.title} />
					{/if}
					<strong>{post.title}</strong>
					<p>{post.summary}</p>
					<small>{formatDate(post.created_at)}</small>
				</a>
			</li>
		{/each}
	</ul>
</main>

{#if showLoginModal}
	<LoginModal
		bind:loginEmail
		bind:loginPassword
		{loginError}
		onClose={closeLoginModal}
		onSubmit={handleLoginSubmit}
	/>
{/if}

<style>
	.page {
		max-width: 880px;
		margin: 0 auto;
		padding: 24px 16px 60px;
	}

	.tabs {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
	}

	.tab {
		text-decoration: none;
		color: #555;
		font-weight: 700;
	}

	.tab.active {
		color: #5366fb;
	}

	h1 {
		margin: 0 0 16px;
	}

	.auth-bar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 10px;
		margin-bottom: 12px;
	}

	.user-name {
		font-size: 13px;
		font-weight: 700;
		color: #334155;
	}

	.auth-btn {
		height: 36px;
		padding: 0 12px;
		border: 1px solid #111827;
		border-radius: 8px;
		background: #fff;
		color: #111827;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
	}

	.admin-help {
		margin: 0 0 12px;
		padding: 10px 12px;
		border: 1px solid #bfdbfe;
		border-radius: 8px;
		background: #eff6ff;
		color: #1d4ed8;
		font-size: 14px;
	}

	.form {
		display: grid;
		gap: 8px;
		margin-bottom: 12px;
	}

	input {
		height: 40px;
		padding: 0 12px;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
	}

	button {
		height: 40px;
		border: 0;
		border-radius: 8px;
		background: #5366fb;
		color: #fff;
		font-weight: 700;
		cursor: pointer;
	}

	.image-editor {
		border: 1px dashed #94a3b8;
		border-radius: 10px;
		padding: 10px;
		background: #f8fafc;
	}

	.file-picker {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		background: #fff;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	.file-picker input {
		display: none;
	}

	.hint {
		margin: 10px 0 0;
		font-size: 13px;
		color: #475569;
	}

	.preview-wrap {
		margin-top: 10px;
		display: grid;
		gap: 8px;
	}

	.preview-wrap img {
		width: min(100%, 420px);
		border-radius: 10px;
		border: 1px solid #d1d5db;
	}

	.remove-image-btn {
		width: fit-content;
		height: 32px;
		padding: 0 10px;
		border-radius: 8px;
		border: 1px solid #ef4444;
		background: #fff;
		color: #b91c1c;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
	}

	.error {
		margin: 8px 0;
		color: #dc2626;
		font-size: 14px;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
		display: grid;
		gap: 10px;
	}

	.list li {
		border: 1px solid #d4d4d8;
		border-radius: 10px;
		background: #fff;
	}

	.list a {
		display: block;
		padding: 12px;
		color: inherit;
		text-decoration: none;
	}

	.item-image {
		display: block;
		width: 100%;
		max-height: 240px;
		object-fit: cover;
		border-radius: 8px;
		margin-bottom: 10px;
	}

	.list p {
		margin: 6px 0;
		color: #334155;
	}

	.list small {
		color: #64748b;
	}
</style>
