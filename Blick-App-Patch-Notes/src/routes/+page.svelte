<script>
	import { resolve } from '$app/paths';
	import { posts } from '$lib/data/posts';
</script>

<main class="wrap">
	<header class="top-bar">
		<button class="admin-btn">로그인</button>
	</header>
	<section class="hero-frame">
		<header class="hero-nav">
			<span>Blick</span>
		</header>
		<div class="hero-body">
			<p class="hero-title">패치노트</p>
		</div>
	</section>

	<section class="list">
		<ul class="grid">
			{#each posts as post (post.id)}
				<li class="card">
					<a href={resolve('/post/[id]', { id: post.id })}>
						<div class="thumb-wrap">
							<img class="thumb" src={post.image} alt={post.title} loading="lazy" />
							<div class="corner"></div>
						</div>
						<p class="meta">
							<span>{post.category}</span>
							<span>|</span>
							<span>{post.date}</span>
						</p>
						<h2>{post.title}</h2>
						<p class="summary">{post.summary}</p>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		background: radial-gradient(circle at 14% 12%, #f7f7f7 0 90px, transparent 91px), #ececec;
		color: #0e1117;
		font-family: 'Space Grotesk', 'SUIT Variable', 'Noto Sans KR', sans-serif;
	}
	.top-bar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.admin-btn {
		margin: 0px 20px 20px 20px;
		padding: 10px 18px; /* 버튼 크기 */
		font-size: 14px; /* 글씨 크기 */
		font-weight: 600;
		background-color: #ffffff;
		color: #111;
		border: 2px solid #111; /* 테두리 */
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.admin-btn:hover {
		background-color: #5366fb;
		color: #fff;
		border: 2px solid #5366fb;
	}

	.wrap {
		max-width: 1440px;
		margin: 0 auto;
		padding: 42px 44px 80px;
	}

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

	.hero-nav {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.hero-body {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 18px;
		margin-top: 16px;
	}

	.hero-title {
		margin: 0 0 16px;
		font-size: clamp(72px, 10vw, 128px);
		font-weight: 800;
		letter-spacing: -0.05em;
		line-height: 0.9;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.hero-frame:hover {
		transform: translateY(-4px);
		box-shadow: 0 22px 36px #0000001f;
		border-color: #5366fb;
	}

	.hero-frame:hover .hero-title {
		color: #5366fb;
	}

	.list {
		margin-top: 46px;
	}

	.grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 40px 30px;
		padding: 0;
		margin: 0;
	}

	a {
		display: block;
		color: #1d2432;
		text-decoration: none;
	}

	.thumb-wrap {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		border: 2px solid #16181d;
		background: #d0d0d0;
	}

	.thumb {
		display: block;
		width: 100%;
		height: 220px;
		object-fit: cover;
		filter: grayscale(100%);
		transition: transform 200ms ease;
	}

	.corner {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 52px;
		height: 42px;
		background: #ff4a30;
	}

	.card:hover .thumb {
		transform: scale(1.03);
	}

	.meta {
		margin: 14px 0 8px;
		font-size: 13px;
		font-weight: 700;
		color: #727272;
		display: flex;
		gap: 8px;
		letter-spacing: 0.03em;
	}

	h2 {
		margin: 0;
		font-size: clamp(26px, 2vw, 34px);
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: #111827;
	}

	.summary {
		margin: 10px 0 0;
		font-size: 17px;
		line-height: 1.5;
		color: #2a2e36;
	}

	@media (max-width: 1100px) {
		.hero-body {
			grid-template-columns: 1fr;
		}

		.hero-title {
			margin-bottom: 0;
		}

		.wrap {
			padding: 28px 20px 56px;
		}

		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}
</style>
