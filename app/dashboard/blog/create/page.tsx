'use client'

import { toast } from '@/components/ui/use-toast'
import { links } from '@/lib/constants/links'
import { defaultCreateBlog } from '@/lib/data'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import BlogForm from '../../../../components/blog/BlogForm'
import { createBlog } from '../../../../lib/actions/blog'
import { BlogFormSchemaType } from '../schema'

export default function CreateForm() {
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
