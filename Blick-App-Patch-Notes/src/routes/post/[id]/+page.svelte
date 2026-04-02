<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<main class="detail-wrap">
	<a class="back-link" href={resolve('/')}>← 목록으로</a>

	<section class="detail-hero">
		<div class="hero-meta">
			<span>{data.post.category}</span>
			<span>|</span>
			<span>{data.post.date}</span>
		</div>
		<h1>{data.post.title}</h1>
	</section>

	<section class="detail-content">
		<img src={data.post.image} alt={data.post.title} />
		<p>{data.post.content}</p>
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
</style>
