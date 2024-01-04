'use client'

import { readBlogs, readFirstBlog } from '@/lib/actions/blog'
import { links } from '@/lib/constants/links'
import { getFromAndTo, normalizeImageUrl } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

const HomeBlogs = () => {
	const [page, setPage] = useState(0)
	const [blog, setBlog] = useState<any>(null)
	const [blogs, setBlogs] = useState<any>([])
	const [active, setActive] = useState(false)

	const fetchBlog = async () => {
		const { data: firstBlog } = await readFirstBlog()
		setBlog(firstBlog)
	}

	const fetchBlogs = async (pageNum: number) => {
		const { from, to } = getFromAndTo(pageNum)

		const { data, error } = await readBlogs(from, to)

		if (data) {
			setBlogs((prev: any) => [...prev, ...data])
		} else if (error) {
			console.error('Error fetching blogs:', error)
		}

		if (data && data?.length < 8) {
			setActive(true)
		}
	}

	useEffect(() => {
		fetchBlog()
		fetchBlogs(0)
	}, [])

	const handleNextClick = async () => {
		const nextPage = page + 1
		setPage(nextPage)
		await fetchBlogs(nextPage)
	}

	if (!blogs?.length) {
		return <div>No blogs available.</div>
	}

	return (
		<>
			<div className={cn('w-full flex gap-5 mb-10', !blog && 'hidden')}>
				{blog && (
					<Link
						href={links.blog + blog.id}
						className='w-full border rounded-md dark:bg-gradient-dark p-5 hover:ring-2 ring-green-500 transition-all cursor-pointer space-y-5 first:lg:col-span-2 first:md:col-span-3 group transform overflow-hidden duration-200'
					>
						<div className='w-full h-72 sm:w-full  md:h-64 xl:h-96  relative'>
							<Image
								priority
								src={normalizeImageUrl(blog.image_url)}
								alt='cover'
								fill
								className='rounded-md object-cover object-center transform transition-all duration-200 group-hover:scale-105'
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
				)}
			</div>
			<div className='w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-10'>
				{blogs.map((blog: any, index: number) => {
					if (blog.id === '17744d19-5921-4f4f-9715-e990578e8828') return null

					return (
						<Link
							href={links.blog + blog.id}
							className='w-full border rounded-md dark:bg-gradient-dark p-5 hover:ring-2 ring-green-500 transition-all cursor-pointer space-y-5 first:lg:col-span-2 first:md:col-span-3 group transform overflow-hidden duration-200'
							key={index}
						>
							<div className='w-full h-72 sm:w-full  md:h-64 xl:h-96  relative'>
								<Image
									priority
									src={normalizeImageUrl(blog.image_url)}
									alt='cover'
									fill
									className=' rounded-md object-cover object-center transform transition-all duration-200 group-hover:scale-105'
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

			<Button
				disabled={active}
				onClick={handleNextClick}
				className='flex justify-center py-7 mb-10 w-full border rounded-md bg-gradient-dark text-white hover:bg-gradient-dark hover:ring-2 ring-green-500 transition-all'
			>
				Следующие блоги
			</Button>
		</>
	)
}
export default HomeBlogs
