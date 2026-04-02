<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';

	// load(+page.ts)에서 전달받은 상세 데이터
	let { data } = $props();

	// 화면에서 수정/표시에 사용할 게시글 상태
	let post = $state({
		id: '',
		category: '',
		date: '',
		title: '',
		summary: '',
		content: '',
		image: ''
	});
	$effect(() => {
		post = { ...data.post };
	});

	// 관리자 여부 및 수정 UI 상태
	let isAdmin = $state(false);
	let isEditing = $state(false);
	let editTitle = $state('');
	let editSummary = $state('');
	let saveError = $state('');
	let saveMessage = $state('');
	let isSaving = $state(false);

	// 선택값: .env에 VITE_ADMIN_EMAIL을 넣으면 해당 이메일만 관리자 권한
	// 비워두면 로그인 사용자 모두 관리자 기능 사용
	const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

	// Supabase session으로 관리자 권한 판단
	function syncAdminBySession(session: { user?: { email?: string } } | null) {
		const email = session?.user?.email ?? '';
		isAdmin = Boolean(session?.user && (ADMIN_EMAIL ? email.toLowerCase() === ADMIN_EMAIL : true));
	}

	// 첫 렌더링 시 세션 조회 + 인증 상태 변화 구독
	onMount(() => {
		if (isSupabaseConfigured) {
			supabase.auth.getSession().then(({ data }) => {
				syncAdminBySession(data.session);
			});
		}

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			syncAdminBySession(session);
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	});

	// 수정 시작: 현재 값으로 폼 초기화
	function openEditMode() {
		editTitle = post.title;
		editSummary = post.summary;
		saveError = '';
		saveMessage = '';
		isEditing = true;
	}

	// 수정 취소
	function cancelEdit() {
		isEditing = false;
		saveError = '';
	}

	// 수정 저장: Supabase posts 테이블 업데이트
	async function handleUpdatePost(event: SubmitEvent) {
		event.preventDefault();

		if (!isAdmin) return;

		if (!editTitle.trim() || !editSummary.trim()) {
			saveError = '제목과 요약은 필수입니다.';
			return;
		}

		if (!isSupabaseConfigured) {
			saveError = 'Supabase 설정이 필요합니다.';
			return;
		}

		isSaving = true;
		saveError = '';
		saveMessage = '';

		const { data: updated, error } = await supabase
			.from('posts')
			.update({
				title: editTitle.trim(),
				summary: editSummary.trim(),
				updated_at: new Date().toISOString()
			})
			.eq('id', Number(post.id))
			.select('id, title, summary, created_at')
			.single();

		if (error || !updated) {
			saveError = `수정 실패: ${error?.message ?? '알 수 없는 오류'}`;
			isSaving = false;
			return;
		}

		// 저장 성공 후 화면 데이터 동기화
		post = {
			...post,
			title: updated.title,
			summary: updated.summary,
			content: updated.summary
		};
		isSaving = false;
		isEditing = false;
		saveMessage = '저장되었습니다.';
	}
</script>

<main class="detail-wrap">
	<a class="back-link" href={resolve('/')}>← 목록으로</a>

	<section class="detail-hero">
		<div class="hero-meta">
			<span>{post.category}</span>
			<span>|</span>
			<span>{post.date}</span>
		</div>
		<h1>{post.title}</h1>
	</section>

	<section class="detail-content">
		<img src={post.image} alt={post.title} />
		<p>{post.content}</p>

		{#if isAdmin}
			<div class="admin-tools">
				{#if !isEditing}
					<button class="edit-btn" type="button" onclick={openEditMode}>수정</button>
				{/if}
			</div>
		{/if}

		{#if saveMessage}
			<p class="save-message">{saveMessage}</p>
		{/if}

		{#if isEditing}
			<form class="edit-form" onsubmit={handleUpdatePost}>
				<label>
					제목
					<input bind:value={editTitle} />
				</label>
				<label>
					요약
					<textarea bind:value={editSummary}></textarea>
				</label>

				{#if saveError}
					<p class="save-error">{saveError}</p>
				{/if}

				<div class="edit-actions">
					<button type="button" class="cancel-btn" onclick={cancelEdit}>취소</button>
					<button type="submit" class="save-btn" disabled={isSaving}>
						{isSaving ? '저장중...' : '저장'}
					</button>
				</div>
			</form>
		{/if}
	</section>
</main>

<style>
	/* Detail Layout: 상세 페이지 기본 컨테이너 */
	.detail-wrap {
		max-width: 980px;
		margin: 0 auto;
		padding: 42px 20px 80px;
	}

	/* Back Link: 목록 복귀 링크 */
	.back-link {
		display: inline-flex;
		align-items: center;
		margin-bottom: 18px;
		font-size: 14px;
		font-weight: 700;
		color: #3741c8;
		text-decoration: none;
	}

	/* Hero Section: 제목/메타 영역 */
	.detail-hero {
		border: 3px solid #16181d;
		border-radius: 18px;
		background: #f5f5f5;
		padding: 22px 24px;
	}

	.hero-meta {
		display: flex;
		gap: 8px;
		font-size: 13px;
		font-weight: 700;
		color: #6b7280;
		letter-spacing: 0.03em;
	}

	h1 {
		margin: 10px 0 0;
		font-size: clamp(34px, 6vw, 52px);
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: #111827;
	}

	/* Content Section: 이미지 + 본문 */
	.detail-content {
		margin-top: 24px;
		background: #ffffff;
		border-radius: 16px;
		padding: 18px;
		box-shadow: 0 10px 22px #00000014;
	}

	.detail-content img {
		width: 100%;
		border-radius: 12px;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.detail-content p {
		margin: 18px 4px 4px;
		font-size: 18px;
		line-height: 1.65;
		color: #1f2937;
		word-break: keep-all;
	}

	/* Admin Tools: 관리자 수정 버튼/폼 */
	.admin-tools {
		margin-top: 16px;
	}

	.edit-btn {
		height: 36px;
		padding: 0 12px;
		border: 1px solid #5366fb;
		border-radius: 8px;
		background: #eef2ff;
		color: #3741c8;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	.save-message {
		margin: 12px 2px 0;
		font-size: 13px;
		font-weight: 700;
		color: #166534;
	}

	.edit-form {
		margin-top: 12px;
		display: grid;
		gap: 10px;
	}

	.edit-form label {
		display: grid;
		gap: 6px;
		font-size: 14px;
		font-weight: 600;
	}

	.edit-form input,
	.edit-form textarea {
		border: 1px solid #9ca3af;
		border-radius: 8px;
		padding: 10px 12px;
		font-size: 14px;
		font-family: inherit;
	}

	.edit-form textarea {
		min-height: 92px;
		resize: vertical;
	}

	.save-error {
		margin: 0;
		font-size: 13px;
		color: #dc2626;
	}

	.edit-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
	}

	.cancel-btn,
	.save-btn {
		height: 36px;
		padding: 0 12px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	.cancel-btn {
		border: 1px solid #9ca3af;
		background: #fff;
		color: #111827;
	}

	.save-btn {
		border: 1px solid #5366fb;
		background: #5366fb;
		color: #fff;
	}
</style>
