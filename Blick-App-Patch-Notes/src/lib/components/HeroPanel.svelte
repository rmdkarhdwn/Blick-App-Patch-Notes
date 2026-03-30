<section class="hero-frame">
	<header class="hero-nav">
		<span class="hero-nav-text">Blick</span>
	</header>
	<div class="hero-body">
		<p class="hero-title">패치노트</p>
	</div>
</section>

<style>
	/* Hero Container: 메인 타이틀 영역 카드 */
	.hero-frame {
		border: 5px solid #16181d;
		border-radius: 26px;
		background: #f5f5f5;
		padding: 18px 24px 28px;
		box-shadow: 0 16px 30px #00000014;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	/* Hero Top Text: 로고 텍스트 줄 */
	.hero-nav {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	/* Hero Title Row: 큰 타이틀 배치 */
	.hero-body {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 18px;
		margin-top: 16px;
	}

	/* Hero Headline: 메인 타이틀 스타일 */
	.hero-title {
		margin: 0 0 16px;
		font-size: clamp(72px, 10vw, 128px);
		font-weight: 800;
		letter-spacing: -0.05em;
		line-height: 0.9;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.hero-nav-text {
		color: #000;
	}

	/* Hero Hover: 포인트 컬러 강조 */
	.hero-frame:hover {
		transform: translateY(-4px);
		box-shadow: 0 22px 36px #0000001f;
		border-color: #5366fb;
	}

	.hero-frame:hover .hero-title,
	.hero-frame:hover .hero-nav-text {
		color: #5366fb;
	}

	@media (max-width: 1100px) {
		.hero-body {
			grid-template-columns: 1fr;
		}

		.hero-title {
			margin-bottom: 0;
		}
	}
</style>
