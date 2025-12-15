import { SearchResult } from '@/types/search';

const API_URL = `${process.env.NEXT_PUBLIC_SERVICE_URL}/search`;

export const getTotalSearchResult = async (query: string) => {
	try {
		// URL 인코딩하여 특수문자 안전하게 처리
		const encodedQuery = encodeURIComponent(query);
		const response = await fetch(`${API_URL}/total?keyword=${encodedQuery}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch search result');
		}

		const data: SearchResult = await response.json();

		return data || { news: [], companies: [] };
	} catch (error) {
		console.error(error);
		return { news: [], companies: [] };
	}
};
