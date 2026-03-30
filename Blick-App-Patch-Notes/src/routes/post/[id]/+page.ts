import { error } from '@sveltejs/kit';
import { posts } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = posts.find((p) => p.id === params.id);

	if (!post) {
		throw error(404, '존재하지 않는 패치노트입니다.');
	}

	return { post };
};
