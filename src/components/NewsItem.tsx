'use client';

import Image from 'next/image';
import Link from 'next/link';

interface NewsItemProps {
	id: number;
	title: string;
	description: string;
	pulishedAt: string; // 2025-11-30
	thumbnailUrl?: string;
	publisher: string;
	author: string;
}

export default function NewsItem({
	id,
	title,
	description,
	pulishedAt,
	thumbnailUrl,
	publisher,
	author,
}: NewsItemProps) {
	// 날짜 포맷팅 (2025-11-30 -> May 31, 2023 형식으로 변환)
	const formatDate = (dateString: string) => {
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

	return (
		<Link
			href={`/news/${id}`}
			className="flex gap-4 p-4 hover:bg-muted/50 transition-colors rounded-lg cursor-pointer border border-border"
		>
			{/* 썸네일 이미지 */}
			<div className="shrink-0 w-32 h-24 bg-muted rounded-lg overflow-hidden border border-border">
				{thumbnailUrl ? (
					<Image src={thumbnailUrl} alt={title} fill className="object-cover" />
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center">
						<span className="text-gray-400 text-xs">이미지</span>
					</div>
				)}
			</div>

			{/* 텍스트 내용 */}
			<div className="flex-1 flex flex-col gap-2 min-w-0">
				<h3 className="font-semibold text-lg leading-tight line-clamp-2">
					{title}
				</h3>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{description}
				</p>
				<div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
					<span className="font-medium">{publisher}</span>
					<span>•</span>
					<span>{author}</span>
					<span>•</span>
					<span>{formatDate(pulishedAt)}</span>
				</div>
			</div>
		</Link>
	);
}
