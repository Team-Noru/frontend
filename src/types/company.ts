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
