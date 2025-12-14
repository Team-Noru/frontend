export type Sentiment =
	| 'positive'
	| 'negative'
	| 'neutral'
	| 'slightlyPositive'
	| 'slightlyNegative';

export interface Tag {
	id: number;
	label: string;
}

export interface Company {
	companyId?: string;
	name: string;
	isListed: boolean;
	isDomestic: boolean;
	sentiment?: Sentiment;
	tags?: Tag[];
	price: number;
}

export interface CompanyDetail extends Company {
	related: Company[];
}

export interface Announcement {
	announcementId: number;
	companyId: string;
	category: string;
	title: string;
	announcementUrl: string;
	publishedAt: string;
}

export interface WordData {
	text: string;
	value: number;
}
