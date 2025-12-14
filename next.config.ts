import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.tossinvest.com',
			},
			{
				protocol: 'https',
				hostname: 'static.hankyung.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'img.hankyung.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'eodhd.com',
				pathname: '/**',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/v1/:path*',
				destination: `${process.env.SERVICE_URL}/:path*`,
			},
		];
	},
};

export default nextConfig;
