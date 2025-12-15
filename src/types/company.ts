export type Sentiment =
	| 'positive'
	| 'negative'
	| 'neutral'
	| 'slightlyPositive'
	| 'slightlyNegative';

export interface Tag {
	id: number;
	direction: 'IN' | 'OUT';
	label: string;
	relReason: string;
}

export interface Company {
	companyId?: string;
	name: string;
	isListed: boolean;
	isDomestic: boolean;
	sentiment?: Sentiment;
	tags?: Tag[];
	price?: number;
	diffPrice?: number;
	diffRate?: number;
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

export type WordType =
	| 'ORG'
	| 'PERSON'
	| 'TECH'
	| 'PRODUCT'
	| 'MARKET'
	| 'FINANCE'
	| 'GOVERNANCE';

export interface WordDataDTO {
	text: string;
	weight: number;
	type: WordType;
}

export interface WordData {
	text: string;
	value: number;
	type?: WordType;
}

export interface CompanyPriceDTO {
	companyId: string;
	name: string;
	price: number;
	diffPrice: number;
	diffRate: number;
}

export interface CompanyWordCloud {
	companyId: string;
	wordList: WordDataDTO[];
}
