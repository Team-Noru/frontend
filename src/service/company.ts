import { ApiResponse } from '@/types/api';
import { News } from '@/types/news';

const API_URL = `${process.env.SERVICE_URL}/companies`;

export const getCompanyNewsById = async (companyId: string) => {
	try {
		const response = await fetch(`${API_URL}/${companyId}/news`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch company news');
		}

		const data: ApiResponse<News[]> = await response.json();
		return data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};
