export const getSentimentLabel = (sentiment?: string): string => {
	switch (sentiment) {
		case 'positive':
			return '긍정';
		case 'negative':
			return '부정';
		case 'neutral':
			return '중립';
		case 'slightlyPositive':
			return '약간 긍정';
		case 'slightlyNegative':
			return '약간 부정';
		default:
			return '';
	}
};

export const getSentimentColor = (sentiment?: string) => {
	switch (sentiment) {
		case 'positive':
			// 녹색 (긍정)
			return 'border-green-300 text-green-700 bg-green-50';
		case 'slightlyPositive':
			// 주황-녹색 계열 (약간 긍정)
			return 'border-emerald-300 text-emerald-700 bg-emerald-50';
		case 'neutral':
			// 노란색 계열 (중립)
			return 'border-yellow-300 text-yellow-700 bg-yellow-50';
		case 'slightlyNegative':
			// 주황-빨강 계열 (약간 부정)
			return 'border-orange-300 text-orange-700 bg-orange-50';
		case 'negative':
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
