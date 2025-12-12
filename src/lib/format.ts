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
