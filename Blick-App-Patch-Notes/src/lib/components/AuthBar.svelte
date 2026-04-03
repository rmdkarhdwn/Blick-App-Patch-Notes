<script lang="ts">
	import tossQr from '$lib/assets/toss-qr.png';

	type BoardType = 'notice' | 'patch';

	// 부모(+page.svelte)에서 내려주는 값/함수 타입
	type Props = {
		isLoggedIn: boolean;
		userName: string;
		currentBoard: BoardType;
		onBoardChange: (board: BoardType) => void;
		onAuthClick: () => void;
	};

	// $props(): 부모 컴포넌트가 전달한 props를 받는 Svelte 5 방식
	let { isLoggedIn, userName, currentBoard, onBoardChange, onAuthClick }: Props = $props();
	let showCoffeeModal = $state(false);

	// 커피 버튼 클릭 시 QR 모달 열기
	function handleCoffeeClick() {
		showCoffeeModal = true;
	}

	// QR 모달 닫기
	function closeCoffeeModal() {
		showCoffeeModal = false;
	}
</script>

<header class="top-bar">
	<!-- 좌측 고정 액션 -->
	<button class="coffee-btn" type="button" onclick={handleCoffeeClick}>커피 사주기</button>

	<!-- 중앙 탭: 오류게시판은 제외하고 공지/패치노트만 사용 -->
	<nav class="board-tabs" aria-label="게시판 선택">
		<button
			class="tab-btn"
			class:active={currentBoard === 'notice'}
			type="button"
			onclick={() => onBoardChange('notice')}
		>
			공지
		</button>
		<button
			class="tab-btn"
			class:active={currentBoard === 'patch'}
			type="button"
			onclick={() => onBoardChange('patch')}
		>
			패치노트
		</button>
	</nav>

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

{#if showCoffeeModal}
	<div class="coffee-backdrop">
		<div class="coffee-modal" role="dialog" aria-modal="true" aria-labelledby="coffee-title">
			<h3 id="coffee-title">개발자 커피 사주기</h3>
			<p>아래 QR을 토스 앱에서 스캔해 1000원을 선물해주세요.</p>
			<img src={tossQr} alt="토스 송금 QR 코드" />
			<div class="coffee-actions">
				<button class="close-btn" type="button" onclick={closeCoffeeModal}>닫기</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Top Action Bar: 로그인/로그아웃 영역 정렬 */
	.top-bar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		margin-bottom: 20px;
		gap: 12px;
	}

	/* Left Action: 개발자 후원 버튼 */
	.coffee-btn {
		justify-self: start;
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

	/* Center Nav: 게시판 탭 */
	.board-tabs {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.tab-btn {
		border: 0;
		background: transparent;
		padding: 6px 0;
		font-size: clamp(22px, 2vw, 44px);
		line-height: 1.1;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: #adb0b6;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.tab-btn:hover {
		color: #5366fb;
	}

	.tab-btn.active {
		color: #5366fb;
	}

	/* Right Action Group: 사용자명 + 로그인 버튼 */
	.auth-group {
		justify-self: end;
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

	/* Coffee QR Modal: 후원 QR 표시 */
	.coffee-backdrop {
		position: fixed;
		inset: 0;
		background: #11182766;
		display: grid;
		place-items: center;
		padding: 20px;
		z-index: 30;
	}

	.coffee-modal {
		width: min(360px, 100%);
		background: #fff;
		border: 2px solid #16181d;
		border-radius: 14px;
		padding: 18px;
		box-shadow: 0 18px 34px #0000002e;
	}

	.coffee-modal h3 {
		margin: 0;
		font-size: 20px;
	}

	.coffee-modal p {
		margin: 8px 0 12px;
		font-size: 14px;
		color: #334155;
	}

	.coffee-modal img {
		width: 100%;
		border-radius: 10px;
		border: 1px solid #d1d5db;
		display: block;
	}

	.coffee-actions {
		margin-top: 12px;
		display: flex;
		justify-content: flex-end;
	}

	.close-btn {
		height: 36px;
		padding: 0 12px;
		border: 1px solid #9ca3af;
		border-radius: 8px;
		background: #fff;
		color: #111827;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	@media (max-width: 980px) {
		.top-bar {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		.coffee-btn,
		.auth-group {
			justify-self: center;
		}

		.board-tabs {
			order: -1;
		}
	}
</style>
