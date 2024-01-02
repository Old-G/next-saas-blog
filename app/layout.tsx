import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/nav/Navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Head from './head'

const poppins = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	metadataBase: new URL('https://ginsights.vercel.app/'),

	title: {
		template: '%s | Startups Daily',
		default: 'Startups Daily',
	},
	authors: {
		name: 'Gleb Zavalov',
	},

	description:
		'Откройте для себя передовые инсайты и инновационные идеи на нашем блоге, посвященном стартапам, технологиям и инвестициям. Здесь вы найдете всё от глубоких аналитических статей о AI и Blockchain до эксклюзивных интервью с фаундерами и экспертами венчурного капитала. Наш блог предлагает уникальные перспективы и последние новости в мире Crypto, Web3 и инновационных технологий. Присоединяйтесь к сообществу предпринимателей и инвесторов, стремящихся расширять горизонты и обогащать свои знания с помощью нашего обширного контента.',
	openGraph: {
		title: 'Startups Daily',
		description:
			'Откройте для себя передовые инсайты и инновационные идеи на нашем блоге, посвященном стартапам, технологиям и инвестициям. Здесь вы найдете всё от глубоких аналитических статей о AI и Blockchain до эксклюзивных интервью с фаундерами и экспертами венчурного капитала. Наш блог предлагает уникальные перспективы и последние новости в мире Crypto, Web3 и инновационных технологий. Присоединяйтесь к сообществу предпринимателей и инвесторов, стремящихся расширять горизонты и обогащать свои знания с помощью нашего обширного контента.',
		url: 'https://ginsights.vercel.app/',
		siteName: 'Ginsights',
		images: '/og.png',
		type: 'website',
	},
	keywords: [
		'Startups Daily',
		'startup',
		'startup blog',
		'vc',
		'blockchain',
		'web3',
		'Стартапы',
		'Инновационные технологии',
		'Искусственный интеллект (AI)',
		'Blockchain',
		'Crypto',
		'Web3',
		'Венчурный капитал',
		'Инвестиции',
		'Фаундеры',
		'Аналитика технологий',
		'Интервью с экспертами',
		'Новости стартапов',
	],
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

			<body className={cn('antialiased dark:bg-[#09090B]', poppins.className)}>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					<main className='max-w-7xl mx-auto lg:pt-10 space-y-10 p-5 lg:p-0'>
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
