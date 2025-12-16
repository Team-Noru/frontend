/**
 * 입력 검증 및 정제 유틸리티 함수
 */

/**
 * 입력값을 정제하여 안전한 문자열로 변환
 * @param input 정제할 입력 문자열
 * @returns 정제된 문자열
 */
export const sanitizeInput = (input: string): string => {
	// 빈 문자열이면 빈 문자열 반환
	if (!input) return '';

	// 최대 길이 제한 (100자)
	const maxLength = 100;
	let sanitized = input.slice(0, maxLength);

	// 제어 문자 및 null 바이트 제거 (ASCII 0-31, 127)
	sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

	// HTML 태그 제거
	sanitized = sanitized.replace(/<[^>]*>/g, '');

	// 악성 프로토콜 패턴 차단 (javascript:, data:, vbscript: 등)
	const maliciousPatterns = [
		/javascript:/gi,
		/data:/gi,
		/vbscript:/gi,
		/on\w+\s*=/gi, // onclick=, onerror= 등 이벤트 핸들러
		/<script/gi,
		/<\/script>/gi,
		/<iframe/gi,
		/<object/gi,
		/<embed/gi,
	];

	for (const pattern of maliciousPatterns) {
		sanitized = sanitized.replace(pattern, '');
	}

	// 연속된 공백을 하나로 제한
	sanitized = sanitized.replace(/\s+/g, ' ');

	// trim 후 빈 문자열이면 빈 문자열 반환
	const trimmed = sanitized.trim();
	return trimmed;
};

/**
 * 입력값이 유효한지 검증
 * @param input 검증할 입력 문자열
 * @returns 유효한 입력이면 true, 그렇지 않으면 false
 */
export const isValidInput = (input: string): boolean => {
	// 빈 문자열 체크
	if (!input.trim()) return false;

	// 최대 길이 체크
	if (input.length > 100) return false;

	// 제어 문자 및 null 바이트 체크 (ASCII 0-31, 127)
	if (/[\x00-\x1F\x7F]/.test(input)) return false;

	// 악성 패턴 체크
	const maliciousPatterns = [
		/javascript:/gi,
		/data:/gi,
		/vbscript:/gi,
		/<script/gi,
		/<iframe/gi,
		/<object/gi,
		/<embed/gi,
	];

	return !maliciousPatterns.some((pattern) => pattern.test(input));
};
