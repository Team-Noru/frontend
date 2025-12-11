'use client';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';

const HomeContainer = () => {
	// 예시 데이터
	const newsData = [
		{
			id: 1,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
			pulishedAt: '2023-05-31',
			thumbnailUrl: undefined,
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
		{
			id: 2,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
			pulishedAt: '2023-05-31',
			thumbnailUrl: undefined,
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
		{
			id: 3,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
			pulishedAt: '2023-05-31',
			thumbnailUrl: undefined,
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
		{
			id: 4,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
			pulishedAt: '2023-05-31',
			thumbnailUrl: undefined,
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
		{
			id: 5,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
			pulishedAt: '2023-05-31',
			thumbnailUrl: undefined,
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
	];

	const companies = [
		{
			id: '1',
			stockCode: '055550',
			name: '신한지주',
			isListed: true,
			sentiment: undefined,
			tags: [],
		},
		{
			id: '2',
			stockCode: '',
			name: '알파벳 A',
			isListed: false,
			sentiment: undefined,
			tags: [],
		},
		{
			id: '3',
			stockCode: '005930',
			name: '삼성전자',
			isListed: true,
			sentiment: undefined,
			tags: [],
		},
		{
			id: '4',
			stockCode: '035420',
			name: '네이버',
			isListed: true,
			sentiment: undefined,
			tags: [],
		},
	];

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-8">
				{/* 헤더 */}
				<h1 className="text-3xl font-bold mb-8">서비스이름</h1>

				{/* 메인 레이아웃 */}
				<div className="flex gap-8">
					{/* 왼쪽: 뉴스 목록 */}
					<div className="flex-1">
						<div className="space-y-2">
							{newsData.map((news) => (
								<NewsItem
									key={news.id}
									id={news.id}
									title={news.title}
									description={news.description}
									pulishedAt={news.pulishedAt}
									thumbnailUrl={news.thumbnailUrl}
									publisher={news.publisher}
									author={news.author}
								/>
							))}
						</div>
					</div>

					{/* 오른쪽: 기업 목록 */}
					<div className="w-80 shrink-0">
						<h2 className="text-2xl font-bold mb-6">기업 목록</h2>
						<div className="space-y-3">
							{companies.map((company) => (
								<CompanyItem
									key={company.id}
									id={company.id}
									stockCode={company.stockCode}
									name={company.name}
									isListed={company.isListed}
									sentiment={company.sentiment}
									tags={company.tags}
									showSentiment={false}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeContainer;
