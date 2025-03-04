import { readBlogAdmin, updateBlogById } from '@/lib/actions/blog'
import { IBlog } from '@/lib/types'
import Actions from './Actions'
import SwitchForm from './SwitchForm'

export default async function BlogTable() {
	const { data: blogs } = await readBlogAdmin()

	return (
		<>
			<div className='rounded-md bg-gradient-dark border-[0.5px] overflow-y-scroll '>
				<div className='w-[535px] md:w-full'>
					<div className='grid grid-cols-5 border-b p-5 dark:text-gray-500'>
						<h1 className=' col-span-2'>Title</h1>
						<h1>Premium</h1>
						<h1>Publish</h1>
					</div>
					<div className='space-y-10 p-5'>
						{blogs?.map((blog, index) => {
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
		</>
	)
}
