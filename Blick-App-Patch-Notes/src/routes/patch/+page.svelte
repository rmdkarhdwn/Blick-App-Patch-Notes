<script lang="ts">
	import { resolve } from '$app/paths';
	import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';

	type PostRow = {
		id: number;
		title: string;
		summary: string;
		created_at: string | null;
		updated_at: string | null;
		board_type: string;
	};

	let { data }: { data: { initialPosts?: PostRow[] } } = $props();

	let posts = $state([] as PostRow[]);
	let title = $state('');
	let summary = $state('');
	let formError = $state('');
	let loadError = $state('');
	let isSubmitting = $state(false);

	$effect(() => {
		posts = data.initialPosts ?? [];
	});

	function formatDate(value: string | null) {
		return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
	}

	async function fetchPatchPosts() {
		if (!isSupabaseConfigured) {
			loadError = 'Supabase 설정이 필요합니다.';
			posts = [];
			return;
		}

		const { data: nextPosts, error } = await supabase
			.from('posts')
			.select('id, title, summary, created_at, updated_at, board_type')
			.eq('board_type', 'patch')
			.order('id', { ascending: false });

		if (error) {
			loadError = `목록 조회 실패: ${error.message}`;
			return;
		}

		loadError = '';
		posts = nextPosts ?? [];
	}

	async function handleCreatePatch(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		if (!title.trim() || !summary.trim()) {
			formError = '제목과 요약을 입력하세요.';
			return;
		}

		if (!isSupabaseConfigured) {
			formError = 'Supabase 설정이 필요합니다.';
			return;
		}

		isSubmitting = true;

		const { error } = await supabase.from('posts').insert([
			{
				title: title.trim(),
				summary: summary.trim(),
				board_type: 'patch'
			}
		]);

		if (error) {
			formError = `패치노트 추가 실패: ${error.message}`;
			isSubmitting = false;
			return;
		}

		title = '';
		summary = '';
		isSubmitting = false;
		await fetchPatchPosts();
	}
</script>

<main class="page">
	<nav class="tabs">
		<a href={resolve('/notice')} class="tab">공지</a>
		<a href={resolve('/patch')} class="tab active">패치노트</a>
	</nav>

	<h1>패치노트</h1>

	<form class="form" onsubmit={handleCreatePatch}>
		<input bind:value={title} placeholder="패치 제목" />
		<input bind:value={summary} placeholder="패치 요약" />
		<button type="submit" disabled={isSubmitting}>
			{isSubmitting ? '추가 중...' : '패치노트 추가'}
		</button>
	</form>

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
					<strong>{post.title}</strong>
					<p>{post.summary}</p>
					<small>{formatDate(post.created_at)}</small>
				</a>
			</li>
		{/each}
	</ul>
</main>

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

	.list p {
		margin: 6px 0;
		color: #334155;
	}

	.list small {
		color: #64748b;
	}
</style>
