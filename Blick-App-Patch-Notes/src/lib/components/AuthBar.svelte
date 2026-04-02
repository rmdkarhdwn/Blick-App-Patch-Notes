<script lang="ts">
	// 부모(+page.svelte)에서 내려주는 값/함수 타입
	type Props = {
		isLoggedIn: boolean;
		userName: string;
		onAuthClick: () => void;
	};

	// $props(): 부모 컴포넌트가 전달한 props를 받는 Svelte 5 방식
	let { isLoggedIn, userName, onAuthClick }: Props = $props();

	// 커피 버튼 클릭 시 외부 후원 링크를 새 탭으로 열기
	function handleCoffeeClick() {
		window.open('https://toss.me/아이디', '_blank', 'noopener,noreferrer');
	}
</script>

<header class="top-bar">
	<!-- 좌측 고정 액션 -->
	<button class="coffee-btn" type="button" onclick={handleCoffeeClick}>커피 사주기</button>

	<!-- 우측 로그인 그룹 -->
	<div class="auth-group">
		{#if isLoggedIn}
			<!-- 로그인 상태에서만 사용자명 표시 -->
			<span class="user-name">{userName}</span>
		{/if}
		<button class="admin-btn" type="button" onclick={onAuthClick}>
			{isLoggedIn ? '로그아웃' : '로그인'}
		</button>
	</div>
</header>

<style>
	/* Top Action Bar: 로그인/로그아웃 영역 정렬 */
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	/* Left Action: 개발자 후원 버튼 */
	.coffee-btn {
		margin: 0;
		padding: 10px 18px;
		font-size: 14px;
		font-weight: 600;
		background-color: #fff7ed;
		color: #9a3412;
		border: 2px solid #fdba74;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.coffee-btn:hover {
		background-color: #ffedd5;
		border-color: #fb923c;
		color: #7c2d12;
	}

	/* Right Action Group: 사용자명 + 로그인 버튼 */
	.auth-group {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* Logged User Label: 로그인 시 버튼 왼쪽에 이름 표시 */
	.user-name {
		font-size: 14px;
		font-weight: 700;
		color: #1f2937;
	}

	/* Auth Button: 기본 버튼 스타일 */
	.admin-btn {
		margin: 0;
		padding: 10px 18px;
		font-size: 14px;
		font-weight: 600;
		background-color: #ffffff;
		color: #000000;
		border: 2px solid #111;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	/* Auth Button Hover: 포인트 컬러 강조 */
	.admin-btn:hover {
		color: #5366fb;
		border-color: #5366fb;
	}
</style>
