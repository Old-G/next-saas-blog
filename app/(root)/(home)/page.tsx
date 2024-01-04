import { readBlog } from '@/lib/actions/blog'
import { links } from '@/lib/constants/links'
import { normalizeImageUrl } from '@/lib/helpers'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
	let { data: blogs } = await readBlog()

	if (!blogs?.length) {
		blogs = []
	}

	return (
		<div className='w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-10'>
			{blogs.map((blog, index) => {
				return (
					<Link
						href={links.blog + blog.id}
						className='w-full  border rounded-md dark:bg-gradient-dark p-5 hover:ring-2 ring-green-500 transition-all cursor-pointer space-y-5 first:lg:col-span-2 first:md:col-span-3'
						key={index}
					>
						<div className='w-full h-72 sm:w-full  md:h-64 xl:h-96  relative'>
							<Image
								priority
								src={normalizeImageUrl(blog.image_url)}
								alt='cover'
								fill
								className=' rounded-md object-cover object-center'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</div>
						<div className='space-y-2'>
							<p className='text-sm dark:text-gray-400'>
								{new Date(blog.created_at).toDateString()}
							</p>

							<h1 className='text-xl font-bold dark:text-gray-300 text-ellipsis overflow-hidden'>
								{blog.title}
							</h1>
						</div>
					</Link>
				)
			})}
		</div>
	)
}
