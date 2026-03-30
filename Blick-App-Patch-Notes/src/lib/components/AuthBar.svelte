<script lang="ts">
	type Props = {
		isLoggedIn: boolean;
		userName: string;
		onAuthClick: () => void;
	};

	let { isLoggedIn, userName, onAuthClick }: Props = $props();
</script>

<header class="top-bar">
	{#if isLoggedIn}
		<span class="user-name">{userName}</span>
	{/if}
	<button class="admin-btn" type="button" onclick={onAuthClick}>
		{isLoggedIn ? '로그아웃' : '로그인'}
	</button>
</header>

<style>
	/* Top Action Bar: 로그인/로그아웃 영역 정렬 */
	.top-bar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 12px;
		padding-right: 20px;
		margin-bottom: 20px;
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
