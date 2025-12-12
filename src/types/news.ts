import { Company } from './company';

export interface News {
	id: number;
	title: string;
	description: string;
	publishedAt: string;
	thumbnailUrl?: string;
	publisher: string;
}

export interface NewsDetail extends News {
	author: string;
	content: string;
	contentUrl: string;
	imageUrl: string[];
	companies: Company[];
}
