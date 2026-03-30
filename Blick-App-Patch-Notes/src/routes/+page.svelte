<script>
	import { resolve } from '$app/paths';

	const posts = [
		{ id: '1', title: 'v1.0 출시', content: '초기 버전 출시' },
		{ id: '2', title: 'v1.1 업데이트', content: '버그 수정' }
	];
</script>

<h1>패치노트 목록</h1>
<ul>
	<!-- "Each block should have a key" 경고 방지를 위해 post.id를 key로 사용 -->
	{#each posts as post (post.id)}
		<li>
			<!-- 내부 라우트 링크는 no-navigation-without-resolve 규칙에 맞게 resolve() 사용 -->
			<a href={resolve('/post/[id]', { id: post.id })}>{post.title}</a>
		</li>
	{/each}
</ul>
