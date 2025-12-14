'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import SearchResults from '@/components/SearchResults';
import BackButton from '@/components/ui/BackButton';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useSearch } from '@/hooks/api/search/useSearch';
import { useDebounce } from '@/hooks/useDebounce';

const Header = () => {
	const pathname = usePathname();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const isHomePage = pathname === '/';
	const debouncedQuery = useDebounce(searchQuery, 300);
	const { data: searchResults, isLoading } = useSearch(debouncedQuery);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
	};

	const handleMobileSearchClick = () => {
		router.push('/search');
	};

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-border">
			{/* 데스크탑 레이아웃 */}
			<div className="hidden lg:block">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex items-center justify-between h-16">
						{/* 로고 - 좌측 */}
						<Link
							href="/"
							className="hover:opacity-80 transition-opacity shrink-0"
						>
							<Image
								src="/linkompany-logo.png"
								alt="LINKompany"
								width={200}
								height={50}
								className="h-12 w-auto"
								priority
							/>
						</Link>

						{/* 검색창 - 우측 */}
						<div className="flex-1 max-w-md ml-auto">
							<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
								<PopoverTrigger>
									<form onSubmit={handleSearch} className="relative">
										<input
											type="text"
											value={searchQuery}
											onChange={(e) => {
												setSearchQuery(e.target.value);
												setIsPopoverOpen(true);
											}}
											onFocus={() => {
												if (searchQuery.trim()) {
													setIsPopoverOpen(true);
												}
											}}
											placeholder="뉴스 또는 기업명 검색..."
											className="w-full px-4 py-2 pl-10 pr-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										/>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
										>
											<circle cx="11" cy="11" r="8" />
											<path d="m21 21-4.35-4.35" />
										</svg>
									</form>
								</PopoverTrigger>
								{isPopoverOpen && debouncedQuery.trim() && (
									<PopoverContent align="end">
										{isLoading ? (
											<div className="p-6 text-center text-sm text-muted-foreground">
												검색 중...
											</div>
										) : searchResults && 'news' in searchResults ? (
											<SearchResults
												news={searchResults.news}
												companies={searchResults.companies}
												onItemClick={() => setIsPopoverOpen(false)}
												searchQuery={debouncedQuery}
											/>
										) : null}
									</PopoverContent>
								)}
							</Popover>
						</div>
					</div>
				</div>
			</div>

			{/* 모바일 레이아웃 */}
			<div className="lg:hidden">
				{isHomePage ? (
					/* 홈 페이지: 로고 + 검색 버튼 */
					<div className="flex items-center justify-between gap-2 h-14 px-4">
						<Link href="/" className="shrink-0">
							<Image
								src="/linkompany-mini-logo.png"
								alt="LINKompany"
								width={120}
								height={36}
								className="h-8 w-auto"
								priority
							/>
						</Link>
						<button
							type="button"
							onClick={handleMobileSearchClick}
							className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-foreground"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</button>
					</div>
				) : (
					/* 다른 페이지: 백버튼 + 검색 버튼 */
					<div className="flex items-center justify-between gap-2 h-14 px-4">
						<BackButton
							fallbackUrl="/"
							className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-foreground"
							>
								<path d="m12 19-7-7 7-7" />
								<path d="M19 12H5" />
							</svg>
						</BackButton>
						<button
							type="button"
							onClick={handleMobileSearchClick}
							className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-foreground"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
