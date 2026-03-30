<script>
	let { data } = $props(); //부모가 넘겨준 props를 꺼내는 방식
</script>

<h1>{data.post.title}</h1>
<p>{data.post.content}</p>
