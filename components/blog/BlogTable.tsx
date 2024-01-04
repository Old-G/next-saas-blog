'use client'

import { Button } from '@/components/ui/button'

import { readBlogAdmin, updateBlogById } from '@/lib/actions/blog'
import { getFromAndTo } from '@/lib/helpers'
import { IBlog } from '@/lib/types'
import { useEffect, useState } from 'react'
import Actions from './Actions'
import SwitchForm from './SwitchForm'

export default function BlogTable() {
	const [page, setPage] = useState(0)
	const [blogs, setBlogs] = useState<any>([])
	const [active, setActive] = useState(false)

	const fetchBlogs = async (pageNum: number) => {
		const { from, to } = getFromAndTo(pageNum)

		const { data, error } = await readBlogAdmin(from, to)

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
		fetchBlogs(0)
	}, [])

	const handleNextClick = async () => {
		const nextPage = page + 1
		setPage(nextPage)
		await fetchBlogs(nextPage)
	}

	return (
		<div className='flex flex-col space-y-5 pb-16'>
			<div className='rounded-md bg-gradient-dark border-[0.5px] overflow-y-scroll '>
				<div className='w-[535px] md:w-full'>
					<div className='grid grid-cols-5 border-b p-5 dark:text-gray-500'>
						<h1 className=' col-span-2'>Title</h1>
						<h1>Premium</h1>
						<h1>Publish</h1>
					</div>
					<div className='space-y-10 p-5'>
						{blogs?.map((blog: any, index: number) => {
							const updatePremium = updateBlogById.bind(null, blog.id, {
								is_premium: !blog.is_premium,
							} as IBlog)

							const updatePublished = updateBlogById.bind(null, blog.id, {
								is_published: !blog.is_published,
							} as IBlog)

							return (
								<div className='grid grid-cols-5 items-center' key={index}>
									<h1 className='dark:text-gray-200 col-span-2 font-lg font-medium text-ellipsis overflow-hidden'>
										{blog.title}
									</h1>
									<SwitchForm
										checked={blog.is_premium}
										onSubmit={updatePremium}
										name='premium'
									/>

									<SwitchForm
										checked={blog.is_published}
										onSubmit={updatePublished}
										name='publish'
									/>

									<Actions id={blog.id} />
								</div>
							)
						})}
					</div>
				</div>
			</div>

			<Button
				disabled={active}
				onClick={handleNextClick}
				className='flex justify-center py-7 mb-10 w-full border rounded-md bg-gradient-dark text-white hover:bg-gradient-dark hover:ring-2 ring-green-500 transition-all'
			>
				Следующие блоги
			</Button>
		</div>
	)
}
