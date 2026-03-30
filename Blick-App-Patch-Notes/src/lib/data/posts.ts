export type Post = {
	id: string;
	category: string;
	date: string;
	title: string;
	summary: string;
	content: string;
	image: string;
};

export const posts: Post[] = [
	{
		id: '1',
		category: 'PATCH',
		date: '2026. 3. 18.',
		title: '26.6 PATCH NOTES',
		summary: '밸런스 조정 및 퍼포먼스 업데이트',
		content: '퍼스트 스탠드와 시바나 관련 업데이트를 포함한 밸런스 조정을 적용했습니다.',
		image:
			'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80'
	},
	{
		id: '2',
		category: 'PATCH',
		date: '2026. 3. 4.',
		title: '26.5 PATCH NOTES',
		summary: '랭크 및 UI 안정화 후속 패치',
		content: '랭크 게임 체감 개선과 챔피언별 지표 안정화를 위한 후속 패치입니다.',
		image:
			'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
	},
	{
		id: '3',
		category: 'PATCH',
		date: '2026. 2. 19.',
		title: '26.4 PATCH NOTES',
		summary: '시즌 이벤트와 챔피언 수치 조정',
		content: '연초 이벤트와 함께 챔피언 일부 스킬 수치를 조정하고 버그를 수정했습니다.',
		image:
			'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80'
	},
	{
		id: '4',
		category: 'PATCH',
		date: '2026. 2. 3.',
		title: '26.3 PATCH NOTES',
		summary: '시스템 메시지와 전투 로그 개선',
		content: '시스템 메시지와 UI 레이아웃을 개선하고 전투 로그 가독성을 높였습니다.',
		image:
			'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
	},
	{
		id: '5',
		category: 'PATCH',
		date: '2026. 1. 21.',
		title: '26.2 PATCH NOTES',
		summary: '정글 동선 밸런싱 및 최적화',
		content: '신규 스킨 출시와 함께 정글 동선 밸런싱 및 퍼포먼스 최적화를 진행했습니다.',
		image:
			'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80'
	},
	{
		id: '6',
		category: 'PATCH',
		date: '2026. 1. 7.',
		title: '26.1 OPENING PATCH',
		summary: '시즌 시작 랭크 및 매칭 로직 개편',
		content: '신규 시즌 시작에 맞춰 랭크 규칙과 매칭 로직을 개편했습니다.',
		image:
			'https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=1200&q=80'
	}
];
