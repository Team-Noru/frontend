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
