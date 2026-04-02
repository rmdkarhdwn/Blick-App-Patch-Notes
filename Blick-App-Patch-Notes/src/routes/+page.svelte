<script lang="ts">
	import { onMount } from 'svelte';
	import AddPatchModal from '$lib/components/AddPatchModal.svelte';
	import AuthBar from '$lib/components/AuthBar.svelte';
	import HeroPanel from '$lib/components/HeroPanel.svelte';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import PatchCard from '$lib/components/PatchCard.svelte';
	import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';

	// 화면에서 사용할 게시글 형태(프론트 UI용)
	type UiPost = {
		id: string;
		category: string;
		date: string;
		title: string;
		summary: string;
		content: string;
		image: string;
	};

	// 화면 상태값($state): 값이 바뀌면 UI가 자동으로 갱신됨
	let postList = $state([] as UiPost[]);
	let isLoadingPosts = $state(false);
	let loadError = $state('');

	let showLoginModal = $state(false);
	let showAddModal = $state(false);
	let isLoggedIn = $state(false);
	let loginId = $state('');
	let loginPassword = $state('');
	let userName = $state('');
	let loginError = $state('');
	let addTitle = $state('');
	let addSummary = $state('');
	let addError = $state('');

	const TEMP_LOGIN = {
		id: 'admin',
		password: '1234',
		name: '관리자'
	};
	// 파생 상태($derived): 로그인 + 관리자 이름일 때만 true
	let isAdmin = $derived(isLoggedIn && userName === TEMP_LOGIN.name);

	// DB row를 화면 표시용 형태로 변환
	function mapRowToUiPost(row: {
		id: number;
		title: string;
		summary: string;
		created_at: string | null;
	}): UiPost {
		const date = row.created_at
			? new Date(row.created_at).toLocaleDateString('ko-KR')
			: new Date().toLocaleDateString('ko-KR');

		return {
			id: String(row.id),
			category: 'PATCH',
			date,
			title: row.title,
			summary: row.summary,
			content: row.summary,
			image: 'https://picsum.photos/1200/675?blur=1'
		};
	}

	// Supabase에서 posts 목록 조회
	async function fetchPosts() {
		if (!isSupabaseConfigured) {
			loadError =
				'Supabase URL/KEY가 설정되지 않았습니다. src/lib/supabaseClient.js 또는 .env를 확인하세요.';
			postList = [];
			return;
		}

		isLoadingPosts = true;
		loadError = '';

		const { data, error } = await supabase
			.from('posts')
			.select('id, title, summary, created_at')
			.order('id', { ascending: false });

		if (error) {
			loadError = `목록 조회 실패: ${error.message}`;
			postList = [];
			isLoadingPosts = false;
			return;
		}

		postList = (data ?? []).map(mapRowToUiPost);
		isLoadingPosts = false;
	}

	// 첫 렌더링 시 게시글 목록 로드
	onMount(fetchPosts);

	// 로그인 버튼 클릭: 로그인/로그아웃 토글
	function handleAuthButtonClick() {
		if (isLoggedIn) {
			isLoggedIn = false;
			userName = '';
			closeAddModal();
			return;
		}

		loginError = '';
		showLoginModal = true;
	}

	// 로그인 모달 닫기 + 입력값 초기화
	function closeLoginModal() {
		showLoginModal = false;
		loginId = '';
		loginPassword = '';
		loginError = '';
	}

	// 관리자 전용: 추가 모달 열기
	function openAddModal() {
		if (!isAdmin) return;
		addError = '';
		showAddModal = true;
	}

	// 추가 모달 닫기 + 폼 초기화
	function closeAddModal() {
		showAddModal = false;
		addTitle = '';
		addSummary = '';
		addError = '';
	}

	// 추가 모달 제출: Supabase posts 테이블에 insert
	async function handleAddPatchSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!isAdmin) return;

		if (!addTitle.trim() || !addSummary.trim()) {
			addError = '제목과 요약은 필수입니다.';
			return;
		}

		if (!isSupabaseConfigured) {
			addError = 'Supabase 설정이 필요합니다.';
			return;
		}

		const { error } = await supabase.from('posts').insert([
			{
				title: addTitle.trim(),
				summary: addSummary.trim()
			}
		]);

		if (error) {
			addError = `추가 실패: ${error.message}`;
			return;
		}

		closeAddModal();
		await fetchPosts();
	}

	// 관리자 전용: 게시글 삭제
	async function handleDeletePost(id: string) {
		if (!isAdmin) return;

		const shouldDelete = confirm('이 패치노트를 삭제할까요?');
		if (!shouldDelete) return;

		if (!isSupabaseConfigured) {
			loadError = 'Supabase 설정이 필요합니다.';
			return;
		}

		const { error } = await supabase.from('posts').delete().eq('id', Number(id));

		if (error) {
			loadError = `삭제 실패: ${error.message}`;
			return;
		}

		await fetchPosts();
	}

	// 로그인 모달 제출: 임시 계정 검증
	function handleLoginSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (loginId === TEMP_LOGIN.id && loginPassword === TEMP_LOGIN.password) {
			isLoggedIn = true;
			userName = TEMP_LOGIN.name;
			closeLoginModal();
			return;
		}

		loginError = '아이디 또는 비밀번호가 올바르지 않습니다.';
	}
</script>

<main class="wrap">
	<!-- 상단 바: 커피 버튼, 로그인/로그아웃 -->
	<AuthBar {isLoggedIn} {userName} onAuthClick={handleAuthButtonClick} />
	<!-- 페이지 대표 히어로 영역 -->
	<HeroPanel />

	<!-- 조회 에러 메시지 -->
	{#if loadError}
		<p class="load-error">{loadError}</p>
	{/if}

	<!-- 로딩 상태 -->
	{#if isLoadingPosts}
		<p class="load-state">패치노트를 불러오는 중...</p>
	{/if}

	<!-- 패치노트 카드 목록 -->
	<section class="list">
		<ul class="grid">
			{#each postList as post (post.id)}
				<PatchCard {post} {isAdmin} onDelete={handleDeletePost} />
			{/each}
		</ul>
	</section>
</main>

<!-- 관리자일 때만 보이는 하단 + 버튼 -->
{#if isAdmin}
	<button class="add-fab" type="button" aria-label="패치노트 추가" onclick={openAddModal}>+</button>
{/if}

<!-- 로그인 모달 -->
{#if showLoginModal}
	<LoginModal
		bind:loginId
		bind:loginPassword
		{loginError}
		onClose={closeLoginModal}
		onSubmit={handleLoginSubmit}
	/>
{/if}

<!-- 패치노트 추가 모달 -->
{#if showAddModal}
	<AddPatchModal
		bind:title={addTitle}
		bind:summary={addSummary}
		errorMessage={addError}
		onClose={closeAddModal}
		onSubmit={handleAddPatchSubmit}
	/>
{/if}

<style>
	/* Global Surface: 페이지 전체 기본 배경/폰트 */
	:global(body) {
		margin: 0;
		background: #ececec;
		color: #0e1117;
		font-family: 'Space Grotesk', 'SUIT Variable', 'Noto Sans KR', sans-serif;
	}

	/* Page Container: 전체 레이아웃 너비/패딩 */
	.wrap {
		max-width: 1440px;
		margin: 0 auto;
		padding: 42px 44px 80px;
	}

	/* Load Message: 데이터 상태 텍스트 */
	.load-error {
		margin: 18px 0 0;
		color: #b91c1c;
		font-size: 14px;
		font-weight: 700;
	}

	.load-state {
		margin: 18px 0 0;
		color: #334155;
		font-size: 14px;
		font-weight: 600;
	}

	/* Card List Section: 히어로와 카드 목록 간격 */
	.list {
		margin-top: 24px;
	}

	/* Grid Layout: 카드 3열 배치 */
	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 40px 30px;
		padding: 0;
		margin: 0;
	}

	/* Breakpoint (Tablet): 2열 배치 */
	@media (max-width: 1100px) {
		.wrap {
			padding: 28px 20px 56px;
		}

		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* Breakpoint (Mobile): 1열 배치 */
	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}

	/* Floating Add Button: 관리자 전용 하단 우측 버튼 */
	.add-fab {
		position: fixed;
		right: 28px;
		bottom: 28px;
		width: 60px;
		height: 60px;
		border: 0;
		border-radius: 999px;
		background: #5366fb;
		color: #ffffff;
		font-size: 34px;
		line-height: 1;
		cursor: pointer;
		box-shadow: 0 16px 24px #1f2db640;
		transition:
			transform 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease;
		z-index: 12;
	}

	.add-fab:hover {
		background: #3741c8;
		transform: translateY(-2px);
		box-shadow: 0 22px 30px #1f2db64d;
	}
</style>
