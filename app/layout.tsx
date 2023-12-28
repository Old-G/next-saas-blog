import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/nav/Navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Head from './head'

const inter = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	metadataBase: new URL('https://dailyblog-demo.vercel.app/'),

	title: {
		template: '%s | Startups Daily',
		default: 'Startups Daily',
	},
	authors: {
		name: 'Gleb Zavalov',
	},

	description:
		'Explore a world of captivating stories and insightful articles on our blog. From the latest trends to in-depth analyses, our blog covers a wide range of topics to keep you informed and entertained. Join our community of readers and discover thought-provoking content that sparks curiosity and fosters discussion. Stay updated with our diverse collection of blog posts, written by passionate contributors who share their expertise and unique perspectives. Engage with a platform that goes beyond the ordinary, providing you with enriching content that resonates with your interests.',
	openGraph: {
		title: 'Startups Daily',
		description:
			'Explore a world of captivating stories and insightful articles on our blog. From the latest trends to in-depth analyses, our blog covers a wide range of topics to keep you informed and entertained. Join our community of readers and discover thought-provoking content that sparks curiosity and fosters discussion. Stay updated with our diverse collection of blog posts, written by passionate contributors who share their expertise and unique perspectives. Engage with a platform that goes beyond the ordinary, providing you with enriching content that resonates with your interests.',
		url: 'https://dailyblog-demo.vercel.app/',
		siteName: 'Startups Daily',
		images: '/og.png',
		type: 'website',
	},
	keywords: ['Startups Daily', 'startup', 'startup blog'],
}

// export const metadata: Metadata = {
//   title: 'Ginsights',
//   description: 'Turn Goals into Gold with Ginsights!',
//   manifest: '/manifest.json',
//   applicationName: 'Ginsights',
//   appleWebApp: {
//     capable: true,
//     title: 'Ginsights',
//     statusBarStyle: 'black-translucent',
//   },
//   formatDetection: {
//     telephone: false,
//   },
// }

export const viewport = {
	initialScale: 1,
	viewportFit: 'cover',
	width: 'device-width',
	userScalable: false,
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head />
			<Head />

			<body className={cn('antialiased dark:bg-[#09090B]', inter.className)}>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					<main className='max-w-7xl mx-auto lg:py-10 space-y-10 p-5 lg:p-0'>
						<Navbar />
						{children}
					</main>
				</ThemeProvider>

				<Toaster />

				<SessionProvider />
			</body>
		</html>
	)
}
