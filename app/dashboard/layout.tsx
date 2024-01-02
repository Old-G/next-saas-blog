import type { Metadata } from 'next'

import { ReactNode } from 'react'
import NavLinks from '../../components/nav/NavLinks'

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
		title: 'Dashboard',
		description:
			'Откройте для себя передовые инсайты и инновационные идеи на нашем блоге, посвященном стартапам, технологиям и инвестициям. Здесь вы найдете всё от глубоких аналитических статей о AI и Blockchain до эксклюзивных интервью с фаундерами и экспертами венчурного капитала. Наш блог предлагает уникальные перспективы и последние новости в мире Crypto, Web3 и инновационных технологий. Присоединяйтесь к сообществу предпринимателей и инвесторов, стремящихся расширять горизонты и обогащать свои знания с помощью нашего обширного контента.',
		url: 'https://ginsights.vercel.app/',
		siteName: 'Ginsights',
		images: '/og-dashboard.png',
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

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<NavLinks />
			{children}
		</>
	)
}
