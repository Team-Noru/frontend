import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
	return (
		<div className="w-full h-full flex items-center justify-center bg-white">
			<div className="max-w-2xl mx-auto px-4 py-8 text-center">
				{/* 404 이미지 */}
				<div className="mb-8 flex justify-center">
					<Image
						src="/notfound.png"
						alt="404 Not Found"
						width={300}
						height={200}
						className="w-full max-w-md h-auto"
						priority
					/>
				</div>

				{/* 메시지 */}
				<h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
					페이지를 찾을 수 없습니다
				</h1>
				<p className="text-lg text-muted-foreground mb-8">
					요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
				</p>

				{/* 홈으로 돌아가기 버튼 */}
				<Link
					href="/"
					className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
				>
					홈으로 돌아가기
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
