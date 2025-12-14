// 오늘 날짜 받아서 YYYY-MM-DD 형식이 아니면 변환하도록하는 코드
export const formatDateToYYYYMMDD = (dateInput: string): string => {
	// 이미 YYYY-MM-DD 형식인지 확인
	const yyyyMMddPattern = /^\d{4}-\d{2}-\d{2}$/;
	if (yyyyMMddPattern.test(dateInput)) {
		return dateInput;
	}

	// Date 객체로 파싱 시도
	const parsedDate = new Date(dateInput);

	// 유효한 날짜인지 확인
	if (isNaN(parsedDate.getTime())) {
		// 유효하지 않은 날짜면 오늘 날짜 반환
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// YYYY-MM-DD 형식으로 변환
	const year = parsedDate.getFullYear();
	const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
	const day = String(parsedDate.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// 전날 날짜를 YYYY-MM-DD 형식으로 반환 (뉴스 스케줄링에 사용)
export const getYesterdayDateString = (): string => {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const year = yesterday.getFullYear();
	const month = String(yesterday.getMonth() + 1).padStart(2, '0');
	const day = String(yesterday.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// 가격 포맷팅 함수
export const formatPrice = (
	priceValue: string | number | undefined
): string => {
	if (!priceValue) return '';
	const numPrice =
		typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
	if (isNaN(numPrice)) return '';
	return `${numPrice.toLocaleString('ko-KR')}원`;
};

// 날짜 포맷팅 (2025-11-30 -> May 31, 2023 형식으로 변환)
export const formatDate = (dateString: string) => {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	} catch {
		return dateString;
	}
};
