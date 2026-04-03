<script lang="ts">
	import favicon from '$lib/assets/gride.png';

	let { children } = $props();
</script>

<svelte:head>
	<title>블릭패치노트</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
