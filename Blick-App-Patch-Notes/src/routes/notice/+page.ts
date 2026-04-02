import { error } from '@sveltejs/kit';
import { isSupabaseConfigured, supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';

// /notice 페이지: board_type = 'notice' 데이터만 조회
export const load: PageLoad = async () => {
	if (!isSupabaseConfigured) {
		throw error(500, 'Supabase 설정이 필요합니다.');
	}

	const { data, error: dbError } = await supabase
		.from('posts')
		.select('id, title, summary, created_at, updated_at, board_type')
		.eq('board_type', 'notice')
		.order('id', { ascending: false });

	if (dbError) {
		throw error(500, `공지 조회 실패: ${dbError.message}`);
	}

	return {
		initialPosts: data ?? []
	};
};
