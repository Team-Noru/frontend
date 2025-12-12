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
}

export interface CompanyDetailData extends Company {
	related: Company[];
}
