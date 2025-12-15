import { WordType } from '@/types/company';

export const getSentimentColor = (sentiment?: string) => {
	switch (sentiment) {
		case '긍정':
			// 녹색 (긍정)
			return 'border-green-300 text-green-700 bg-green-50';
		case '중립':
			// 노란색 계열 (중립)
			return 'border-yellow-300 text-yellow-700 bg-yellow-50';
		case '부정':
			// 빨강 (부정)
			return 'border-red-300 text-red-700 bg-red-50';
		default:
			return 'border-gray-300 text-gray-600 bg-gray-50';
	}
};

export const getStockImageUrl = (code?: string, isDomestic: boolean = true) => {
	if (!code) {
		return null;
	}
	if (isDomestic) {
		const encodedUrl = encodeURIComponent(
			`https://static.toss.im/png-icons/securities/icn-sec-fill-${code}.png`
		);
		return `https://images.tossinvest.com/${encodedUrl}?width=64&height=64`;
	} else {
		const smallCode = code.toLowerCase();
		return `https://eodhd.com/img/logos/US/${smallCode}.png`;
	}
};

// 타입별 레이블 매핑
export const getLabelByType = (type: WordType): string => {
	const labelMap: Record<WordType, string> = {
		ORG: '기업/기관',
		PERSON: '인물',
		TECH: '기술/반도체',
		PRODUCT: '제품/서비스',
		MARKET: '시장',
		FINANCE: '실적/재무',
		GOVERNANCE: '지배구조',
	};
	return labelMap[type];
};
