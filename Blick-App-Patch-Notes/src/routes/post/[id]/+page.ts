import { error } from '@sveltejs/kit';
import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';

// 상세 페이지는 DB에서 id로 게시글 1개를 조회한다.
export const load: PageLoad = async ({ params }) => {
	if (!isSupabaseConfigured) {
		throw error(500, 'Supabase 설정이 필요합니다.');
	}

	const { data, error: dbError } = await supabase
		.from('posts')
		.select('id, title, summary, created_at, board_type, image_url')
		.eq('id', Number(params.id))
		.single();

	if (dbError || !data) {
		throw error(404, '존재하지 않는 패치노트입니다.');
	}

	const boardType = data.board_type === 'notice' ? 'notice' : 'patch';

	const post = {
		id: String(data.id),
		boardType,
		category: boardType === 'notice' ? 'NOTICE' : 'PATCH',
		date: data.created_at ? new Date(data.created_at).toLocaleDateString('ko-KR') : '',
		title: data.title,
		summary: data.summary,
		content: data.summary,
		image: data.image_url || 'https://picsum.photos/1200/675?blur=1'
	};

	return { post };
};
