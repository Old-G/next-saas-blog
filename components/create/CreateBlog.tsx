'use client'

import { BlogFormSchemaType } from '@/app/dashboard/blog/schema'
import { links } from '@/lib/constants/links'
import { defaultCreateBlog } from '@/lib/data'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import BlogForm from '../blog/BlogForm'
import { toast } from '../ui/use-toast'

const CreateBlog = () => {
	const router = useRouter()

	const onHandleSubmit = async (
		data: BlogFormSchemaType,
		imageFile: string
	) => {
		const result = JSON.parse(
			//@ts-ignore
			await createBlog(data, imageFile)
		) as PostgrestSingleResponse<null>

		const { error } = result as PostgrestSingleResponse<null>
		if (error?.message) {
			toast({
				title: 'Fail to create a post 😢',
				description: (
					<div className='mt-2 border-red-400 rounded-md bg-slate-950 p-4'>
						<p className=''>{error.message}</p>
					</div>
				),
			})
		} else {
			toast({
				title: 'Successfully create a post 🎉',
				description: (
					<div className='mt-2 border-green-400 rounded-md bg-slate-950 p-4'>
						<p className=''>{data.title}</p>
					</div>
				),
			})
			router.push(links.dashboard)
		}
	}

	return (
		<BlogForm onHandleSubmit={onHandleSubmit} defaultBlog={defaultCreateBlog} />
	)
}
export default CreateBlog
