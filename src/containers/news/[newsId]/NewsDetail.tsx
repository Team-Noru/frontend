import { FC } from 'react';

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
		return <div>News not found</div>;
	}

	return <NewsDetailClient newsData={newsData} />;
};

export default NewsDetailContainer;
