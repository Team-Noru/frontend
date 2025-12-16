/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.tossinvest.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'noru-stock-images.s3.ap-northeast-2.amazonaws.com',
				pathname: '**',
			},
		],
	},
	async rewrites() {
		if (process.env.NODE_ENV === 'development') {
			return [
				{
					source: '/api/v1/:path*',
					destination: `${process.env.SERVICE_URL}/:path*`,
				},
			];
		} else {
			return [];
		}
	},
};

export default nextConfig;
