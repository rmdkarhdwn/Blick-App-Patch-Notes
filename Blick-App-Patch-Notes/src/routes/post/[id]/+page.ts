import { error } from '@sveltejs/kit';

const posts = [
	{ id: '1', title: 'v1.0 출시', content: '초기 버전 출시' },
	{ id: '2', title: 'v1.1 업데이트', content: '버그 수정' }
];

export function load({ params }) {
	const post = posts.find((p) => p.id === params.id);

	if (!post) {
		throw error(404, '존재하지 않는 패치노트입니다.');
	}

	return { post };
}
