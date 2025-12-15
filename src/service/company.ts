import { ApiResponse } from '@/types/api';
import {
	Announcement,
	CompanyDetail,
	CompanyPriceDTO,
	CompanyWordCloud,
} from '@/types/company';
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

export const getCompanyAnnouncementsById = async (companyId: string) => {
	try {
		const response = await fetch(`${API_URL}/${companyId}/announcement`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch company announcements');
		}

		const data: ApiResponse<Announcement[]> = await response.json();
		return data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getCompanyDetailById = async (companyId: string) => {
	try {
		const response = await fetch(`${API_URL}/${companyId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch company detail');
		}

		const data: ApiResponse<CompanyDetail> = await response.json();
		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getHomeCompanies = async () => {
	try {
		const response = await fetch(`${API_URL}/price`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			next: {
				revalidate: 60,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch home companies');
		}

		const data: ApiResponse<CompanyPriceDTO[]> = await response.json();

		return data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getCompanyWordCloudById = async (companyId: string) => {
	try {
		const response = await fetch(`${API_URL}/${companyId}/wordCloud`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch company word cloud');
		}

		const data: ApiResponse<CompanyWordCloud> = await response.json();
		return data.data;
	} catch (error) {
		console.error(error);
		return {
			companyId: companyId,
			wordList: [],
		};
	}
};
