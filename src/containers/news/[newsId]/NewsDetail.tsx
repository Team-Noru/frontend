import { FC } from 'react';

import Image from 'next/image';

import CompanyItem from '@/components/CompanyItem';

interface Props {
	params: Promise<{
		newsId: string;
	}>;
}

interface RelatedCompany {
	id: string;
	stockCode: string;
	name: string;
	isListed: boolean;
	sentiment:
		| 'positive'
		| 'negative'
		| 'neutral'
		| 'slightlyPositive'
		| 'slightlyNegative';
	tags: Array<{
		id: number;
		label: string;
	}>;
}

const NewsDetailContainer: FC<Props> = async ({ params }) => {
	const { newsId } = await params;

	// TODO: 실제 API 호출로 대체
	// 예시 데이터
	const newsData = {
		id: newsId,
		title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
		content: `한국에서 AI 분야 인재 유출이 가속화되고 있다. 미국 기업들이 AI 엔지니어에게 연봉 200억원을 제시하는 등 
		높은 보상과 우수한 인프라를 바탕으로 인재를 유치하고 있기 때문이다. 이에 따라 국내 AI 전문가들이 해외로 
		빠져나가고 있으며, 이는 'AI 블랙홀' 현상으로 불리고 있다. 전문가들은 국내 기업들의 보상 수준 개선과 
		연구 인프라 확충이 시급하다고 지적하고 있다.`,
		publisher: 'SBS BIZ',
		author: '홍길동',
		pulishedAt: '2023-05-31',
		thumbnailUrl: undefined,
	};

	const relatedCompanies: RelatedCompany[] = [
		{
			id: '1',
			stockCode: '005930',
			name: '삼성전자',
			isListed: true,
			sentiment: 'positive',
			tags: [
				{ id: 1, label: '반도체' },
				{ id: 2, label: 'AI' },
			],
		},
		{
			id: '2',
			stockCode: '035720',
			name: '카카오',
			isListed: true,
			sentiment: 'slightlyPositive',
			tags: [
				{ id: 3, label: '플랫폼' },
				{ id: 4, label: 'AI' },
			],
		},
		{
			id: '3',
			stockCode: '035420',
			name: '네이버',
			isListed: true,
			sentiment: 'neutral',
			tags: [{ id: 5, label: '플랫폼' }],
		},
		{
			id: '4',
			stockCode: '',
			name: 'OpenAI',
			isListed: false,
			sentiment: 'negative',
			tags: [
				{ id: 6, label: 'AI' },
				{ id: 7, label: '해외' },
			],
		},
	];

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-8">
				<div className="flex gap-8">
					{/* 좌측: 뉴스 전문 */}
					<div className="flex-1">
						<article className="space-y-6">
							{/* 헤더 */}
							<header className="space-y-4">
								<h1 className="text-3xl font-bold leading-tight">
									{newsData.title}
								</h1>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<span className="font-medium">{newsData.publisher}</span>
									<span>•</span>
									<span>{newsData.author}</span>
									<span>•</span>
									<span>
										{new Date(newsData.pulishedAt).toLocaleDateString('ko-KR', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</span>
								</div>
							</header>

							{/* 썸네일 */}
							{newsData.thumbnailUrl ? (
								<div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
									<Image
										src={newsData.thumbnailUrl}
										alt={newsData.title}
										fill
										className="object-cover"
									/>
								</div>
							) : (
								<div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
									<span className="text-muted-foreground">이미지</span>
								</div>
							)}

							{/* 본문 */}
							<div className="prose prose-lg max-w-none">
								<p className="text-base leading-7 whitespace-pre-line">
									{newsData.content}
								</p>
							</div>
						</article>
					</div>

					{/* 우측: 연관 기업 목록 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							<h2 className="text-2xl font-bold mb-4">연관 기업</h2>
							<div className="space-y-3">
								{relatedCompanies.map((company) => (
									<CompanyItem
										key={company.id}
										id={company.id}
										stockCode={company.stockCode}
										name={company.name}
										isListed={company.isListed}
										sentiment={company.sentiment}
										tags={company.tags}
										showSentiment={true}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewsDetailContainer;
