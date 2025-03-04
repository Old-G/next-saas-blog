/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'plus.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'source.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'ydclpjukciykeyssrndh.supabase.co',
			},
		],
	},
	serverActions: {
		bodySizeLimit: 5,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
}

module.exports = nextConfig
