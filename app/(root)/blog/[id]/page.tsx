import { normalizeImageUrl } from '@/lib/helpers'
import { IBlog } from '@/lib/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Content from '../../../../components/skeletons-content/Content'

// export async function generateStaticParams() {
// 	const { data: blogs } = await fetch(
// 		process.env.NEXT_PUBLIC_SITE_URL + '/api/blog?id=*'
// 	).then(res => res?.json())

// 	return blogs
// }

const START_BLOG_ID = '17744d19-5921-4f4f-9715-e990578e8828'

export async function generateMetadata({ params }: { params: { id: string } }) {
	const { data: blog } = (await fetch(
		process.env.NEXT_PUBLIC_SITE_URL + '/api/blog?id=' + params.id
	).then(res => res?.json())) as { data: IBlog }

	return {
		title: blog?.title,
		authors: {
			name: 'Gleb Zavalov',
		},
		openGraph: {
			title: blog?.title,
			url: 'https://ginsights.vercel.app/blog' + params.id,
			siteName: 'Ginsights',
			images: blog?.image_url,
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
}

export default async function page({ params }: { params: { id: string } }) {
	const { data: blog } = (await fetch(
		process.env.NEXT_PUBLIC_SITE_URL + '/api/blog?id=' + params.id
	).then(res => res?.json())) as { data: IBlog }

	if (!blog?.id) {
		return <h1 className='text-white'>Not found</h1>
	}

	return (
		<div className='max-w-5xl mx-auto min-h-screen py-10 space-y-10 text-center md:text-left'>
			<div className='sm:px-10 space-y-5 text-ellipsis overflow-hidden'>
				<h1 className=' text-3xl font-bold dark:text-gray-200 text-ellipsis overflow-hidden'>
					{blog?.title}
				</h1>
				<p className='text-sm dark:text-gray-400'>
					{new Date(blog?.created_at!).toDateString()}
				</p>
			</div>

			<div
				className={cn(
					'w-full h-[335px] relative',
					blog?.id === START_BLOG_ID ? 'md:h-96' : 'md:h-[1000px]'
				)}
			>
				<Image
					priority
					src={normalizeImageUrl(blog?.image_url!)}
					alt='cover'
					fill
					className='object-contain md:object-cover object-center rounded-md md:border-[0.5px] md:border-zinc-600'
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				/>
			</div>
			<Content blogId={params.id} />
		</div>
	)
}
