import { formatDateToYYYYMMDD } from '@/lib/format';
import { ApiResponse } from '@/types/api';
import { News, NewsDetail } from '@/types/news';

const API_URL = `${process.env.SERVICE_URL}/news`;
// const CLIENT_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/news`;

export const getNewsByDate = async (date: string) => {
	const formattedDate = formatDateToYYYYMMDD(date);
	try {
		const response = await fetch(`${API_URL}?date=${formattedDate}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			next: {
				revalidate: 60 * 15,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch news list');
		}

		const data: ApiResponse<News[]> = await response.json();
		return data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getNewsDetailById = async (newsId: number) => {
	try {
		const response = await fetch(`${API_URL}/${newsId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch news detail');
		}

		const data: ApiResponse<NewsDetail> = await response.json();
		return data.data ?? null;
	} catch (error) {
		console.error(error);
		return null;
	}
};
