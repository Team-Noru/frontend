import { WordType } from '@/types/company';

// 기업명을 기반으로 일관된 색상 생성
export const getCompanyColor = (companyName: string): string => {
	let hash = 0;
	for (let i = 0; i < companyName.length; i++) {
		hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
	}

	// 부드러운 파스텔 톤 색상 생성
	const hue = Math.abs(hash) % 360;
	const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
	const lightness = 70 + (Math.abs(hash) % 15); // 70-85%

	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// 타입별 색상 매핑
export const getColorByType = (type: WordType): string => {
	const colorMap: Record<WordType, string> = {
		ORG: '#3b82f6', // 파랑 (blue-500)
		PERSON: '#f97316', // 주황 (orange-500)
		TECH: '#a855f7', // 보라 (purple-500)
		PRODUCT: '#10b981', // 초록 (green-500)
		MARKET: '#0ea5e9', // 하늘 (sky-500)
		FINANCE: '#059669', // 진초록 (emerald-600)
		GOVERNANCE: '#6b7280', // 회색 (gray-500)
	};
	return colorMap[type];
};
