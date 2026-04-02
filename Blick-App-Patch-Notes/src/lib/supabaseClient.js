import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL/키
// 실제 프로젝트 값으로 교체하거나 .env의 VITE_* 값을 사용하세요.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// placeholder인지 확인해서 사용자에게 설정 필요 메시지를 줄 때 사용
export const isSupabaseConfigured =
	!supabaseUrl.includes('YOUR_PROJECT_ID') && !supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY');

// 어디서든 사용할 수 있는 Supabase 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
