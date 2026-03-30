<script lang="ts">
	import { posts } from '$lib/data/posts';
	import AuthBar from '$lib/components/AuthBar.svelte';
	import HeroPanel from '$lib/components/HeroPanel.svelte';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import PatchCard from '$lib/components/PatchCard.svelte';

	let showLoginModal = $state(false);
	let isLoggedIn = $state(false);
	let loginId = $state('');
	let loginPassword = $state('');
	let userName = $state('');
	let loginError = $state('');

	const TEMP_LOGIN = {
		id: 'admin',
		password: '1234',
		name: '관리자'
	};

	function handleAuthButtonClick() {
		if (isLoggedIn) {
			isLoggedIn = false;
			userName = '';
			return;
		}

		loginError = '';
		showLoginModal = true;
	}

	function closeLoginModal() {
		showLoginModal = false;
		loginId = '';
		loginPassword = '';
		loginError = '';
	}

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
	<AuthBar {isLoggedIn} {userName} onAuthClick={handleAuthButtonClick} />
	<HeroPanel />

	<section class="list">
		<ul class="grid">
			{#each posts as post (post.id)}
				<PatchCard {post} />
			{/each}
		</ul>
	</section>
</main>

{#if showLoginModal}
	<LoginModal
		bind:loginId
		bind:loginPassword
		{loginError}
		onClose={closeLoginModal}
		onSubmit={handleLoginSubmit}
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

	/* Card List Section: 히어로와 카드 목록 간격 */
	.list {
		margin-top: 46px;
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
</style>
