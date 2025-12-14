import { Suspense } from 'react';

import SearchClient from './Search.client';

export default function Search() {
	return (
		<Suspense fallback={<div>로딩 중입니다...</div>}>
			<SearchClient />
		</Suspense>
	);
}
