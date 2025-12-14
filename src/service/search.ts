import { SearchResult } from '@/types/search';

const API_URL = `${process.env.NEXT_PUBLIC_SERVICE_URL}/search`;

export const getTotalSearchResult = async (query: string) => {
	try {
		const response = await fetch(`${API_URL}/total?keyword=${query}`, {
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
