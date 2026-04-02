<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Post } from '$lib/data/posts';

	// 부모에서 받는 데이터/옵션
	type Props = {
		post: Post;
		isAdmin?: boolean;
		onDelete?: (id: string) => void;
	};

	// 카드 1개에 필요한 props 받기
	let { post, isAdmin = false, onDelete }: Props = $props();

	// 삭제 버튼 클릭 시 카드 링크 이동을 막고 부모에 삭제 요청 전달
	function handleDeleteClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		onDelete?.(post.id);
	}
</script>

<li class="card">
	{#if isAdmin}
		<button class="delete-btn" type="button" onclick={handleDeleteClick}>삭제</button>
	{/if}
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

<style>
	/* Card Container: 카드 단위 여백/구조 */
	.card {
		list-style: none;
		position: relative;
	}

	/* Card Link: 카드 전체 클릭 영역 */
	a {
		display: block;
		color: #1d2432;
		text-decoration: none;
	}

	/* Delete Button: 관리자 전용 카드 삭제 */
	.delete-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 2;
		height: 32px;
		padding: 0 10px;
		border: 1px solid #dc2626;
		border-radius: 999px;
		background: #ffffffd9;
		color: #b91c1c;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.delete-btn:hover {
		background: #dc2626;
		color: #ffffff;
	}

	/* Thumbnail Frame: 이미지 테두리/모서리 */
	.thumb-wrap {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		border: 2px solid #16181d;
		background: #d0d0d0;
		transition: border-color 0.2s ease;
	}

	/* Thumbnail Image: hover 시 확대 */
	.thumb {
		display: block;
		width: 100%;
		height: 220px;
		object-fit: cover;
		filter: grayscale(100%);
		transition:
			transform 200ms ease,
			filter 200ms ease;
	}

	/* Accent Block: 카드 우하단 포인트 컬러 */
	.corner {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 52px;
		height: 42px;
		background: #ff4a30;
	}

	/* Meta Text: 카테고리/날짜 */
	.meta {
		margin: 14px 0 8px;
		font-size: 13px;
		font-weight: 700;
		color: #727272;
		display: flex;
		gap: 8px;
		letter-spacing: 0.03em;
		transition: color 0.2s ease;
	}

	/* Card Title */
	h2 {
		margin: 0;
		font-size: clamp(26px, 2vw, 34px);
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: #111827;
		transition: color 0.2s ease;
	}

	/* Card Summary */
	.summary {
		margin: 10px 0 0;
		font-size: 17px;
		line-height: 1.5;
		color: #2a2e36;
		transition: color 0.2s ease;
	}

	/* Card Hover: 테두리/텍스트 포인트 컬러 */
	.card:hover .thumb-wrap {
		border-color: #5366fb;
	}

	.card:hover .thumb {
		transform: scale(1.03);
		filter: grayscale(0%);
	}

	.card:hover .meta,
	.card:hover h2,
	.card:hover .summary {
		color: #5366fb;
	}
</style>
