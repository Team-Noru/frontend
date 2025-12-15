import { FC } from 'react';

import NotFound from '@/components/ui/NotFound';
import { getNewsDetailById } from '@/service/news';

import NewsDetailClient from './NewsDetail.client';

interface Props {
	params: Promise<{
		newsId: string;
	}>;
}

const NewsDetailContainer: FC<Props> = async ({ params }) => {
	const { newsId } = await params;

	const newsData = await getNewsDetailById(Number(newsId));

	if (!newsData) {
		return (
			<NotFound
				title="뉴스를 찾을 수 없습니다"
				description="요청하신 뉴스가 존재하지 않거나 삭제되었을 수 있습니다."
				imageAlt="News Not Found"
			/>
		);
	}

	return <NewsDetailClient newsData={newsData} />;
};

export default NewsDetailContainer;
