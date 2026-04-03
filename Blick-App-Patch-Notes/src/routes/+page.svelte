<script lang="ts">
	import { onMount } from 'svelte';
	import AddPatchModal from '$lib/components/AddPatchModal.svelte';
	import AuthBar from '$lib/components/AuthBar.svelte';
	import HeroPanel from '$lib/components/HeroPanel.svelte';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import PatchCard from '$lib/components/PatchCard.svelte';
	import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';

	type BoardType = 'notice' | 'patch';

	// 화면에서 사용할 게시글 형태(프론트 UI용)
	type UiPost = {
		id: string;
		boardType: BoardType;
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
	let currentBoard = $state('patch' as BoardType);

	let showLoginModal = $state(false);
	let showAddModal = $state(false);
	let isLoggedIn = $state(false);
	let isAdmin = $state(false);
	let loginEmail = $state('');
	let loginPassword = $state('');
	let userName = $state('');
	let loginError = $state('');
	let addTitle = $state('');
	let addSummary = $state('');
	let addError = $state('');

	// 공지/패치 탭 라벨을 한 곳에서 관리
	function getBoardLabel(board: BoardType) {
		return board === 'notice' ? '공지' : '패치노트';
	}

	// URL query(?board=notice|patch)에서 안전하게 게시판 타입 읽기
	function parseBoardParam(value: string | null): BoardType {
		return value === 'notice' ? 'notice' : 'patch';
	}

	// 탭 변경 시 URL도 함께 갱신해서 새로고침해도 같은 탭 유지
	function syncBoardQuery(board: BoardType) {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (board === 'patch') {
			url.searchParams.delete('board');
		} else {
			url.searchParams.set('board', board);
		}
		window.history.replaceState(window.history.state, '', url.toString());
	}

	// 선택값: .env에 VITE_ADMIN_EMAIL을 넣으면 해당 이메일만 관리자 권한 부여
	// 비워두면(기본값) 로그인한 사용자 모두 관리자 기능 사용 가능
	const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

	// Supabase session을 화면 상태로 반영
	function applyAuthSession(
		session: { user?: { email?: string; user_metadata?: { name?: string } } } | null
	) {
		const email = session?.user?.email ?? '';
		const displayName = session?.user?.user_metadata?.name || email || '';

		isLoggedIn = Boolean(session?.user);
		userName = displayName;
		isAdmin = Boolean(session?.user && (ADMIN_EMAIL ? email.toLowerCase() === ADMIN_EMAIL : true));

		// 로그아웃 상태로 바뀌면 관리자 전용 UI를 닫아준다.
		if (!isLoggedIn) {
			closeAddModal();
		}
	}

	// DB row를 화면 표시용 형태로 변환
	function mapRowToUiPost(row: {
		id: number;
		title: string;
		summary: string;
		created_at: string | null;
		board_type?: string | null;
	}): UiPost {
		const date = row.created_at
			? new Date(row.created_at).toLocaleDateString('ko-KR')
			: new Date().toLocaleDateString('ko-KR');
		const boardType = row.board_type === 'notice' ? 'notice' : 'patch';

		return {
			id: String(row.id),
			boardType,
			category: boardType === 'notice' ? 'NOTICE' : 'PATCH',
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
			.select('id, title, summary, created_at, board_type')
			.eq('board_type', currentBoard)
			.order('id', { ascending: false });

		if (error) {
			if (error.message.includes('board_type')) {
				loadError =
					"posts 테이블에 board_type 컬럼이 필요합니다. 예) alter table posts add column board_type text default 'patch';";
				postList = [];
				isLoadingPosts = false;
				return;
			}
			loadError = `목록 조회 실패: ${error.message}`;
			postList = [];
			isLoadingPosts = false;
			return;
		}

		postList = (data ?? []).map(mapRowToUiPost);
		isLoadingPosts = false;
	}

	// 첫 렌더링 시:
	// 1) 현재 세션 복원
	// 2) auth 상태 변화 감지
	// 3) 게시글 목록 조회
	onMount(() => {
		if (typeof window !== 'undefined') {
			currentBoard = parseBoardParam(new URL(window.location.href).searchParams.get('board'));
		}

		if (isSupabaseConfigured) {
			supabase.auth.getSession().then(({ data }) => {
				applyAuthSession(data.session);
			});
		}

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			applyAuthSession(session);
		});

		fetchPosts();

		return () => {
			authListener.subscription.unsubscribe();
		};
	});

	// 중앙 탭 변경(공지/패치노트)
	function handleBoardChange(board: BoardType) {
		if (currentBoard === board) return;
		currentBoard = board;
		syncBoardQuery(board);
		fetchPosts();
	}

	// 로그인 버튼 클릭: 로그인/로그아웃 토글
	async function handleAuthButtonClick() {
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

	// 로그인 모달 닫기 + 입력값 초기화
	function closeLoginModal() {
		showLoginModal = false;
		loginEmail = '';
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
				summary: addSummary.trim(),
				board_type: currentBoard
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

		const shouldDelete = confirm(`이 ${getBoardLabel(currentBoard)}를 삭제할까요?`);
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

	// 로그인 모달 제출: Supabase Auth 이메일/비밀번호 로그인
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
</script>

<main class="wrap">
	<!-- 상단 바: 커피 버튼, 로그인/로그아웃 -->
	<AuthBar
		{isLoggedIn}
		{userName}
		{currentBoard}
		onBoardChange={handleBoardChange}
		onAuthClick={handleAuthButtonClick}
	/>
	<!-- 페이지 대표 히어로 영역 -->
	<HeroPanel title={getBoardLabel(currentBoard)} />

	<!-- 조회 에러 메시지 -->
	{#if loadError}
		<p class="load-error">{loadError}</p>
	{/if}

	<!-- 로딩 상태 -->
	{#if isLoadingPosts}
		<p class="load-state">{getBoardLabel(currentBoard)}를 불러오는 중...</p>
	{/if}

	<!-- 패치노트 카드 목록 -->
	<section class="list">
		{#if !isLoadingPosts && !loadError && postList.length === 0}
			<p class="load-empty">등록된 {getBoardLabel(currentBoard)}가 없습니다.</p>
		{:else}
			<ul class="grid">
				{#each postList as post (post.id)}
					<PatchCard {post} {isAdmin} onDelete={handleDeletePost} />
				{/each}
			</ul>
		{/if}
	</section>
</main>

<!-- 관리자일 때만 보이는 하단 + 버튼 -->
{#if isAdmin}
	<button
		class="add-fab"
		type="button"
		aria-label={`${getBoardLabel(currentBoard)} 추가`}
		onclick={openAddModal}
	>
		+
	</button>
{/if}

<!-- 로그인 모달 -->
{#if showLoginModal}
	<LoginModal
		bind:loginEmail
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
		boardLabel={getBoardLabel(currentBoard)}
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

	.load-empty {
		margin: 18px 0 0;
		color: #475569;
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
