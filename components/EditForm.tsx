'use client'

import { toast } from '@/components/ui/use-toast'

import { IBlogDetails } from '@/lib/types'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { BlogFormSchemaType } from '../app/dashboard/blog/schema'
import { updateBlogDetail } from '../lib/actions/blog'
import BlogForm from './blog/BlogForm'

export default function EditForm({ blog }: { blog: IBlogDetails }) {
	const router = useRouter()

	const onHandleSubmit = async (
		data: BlogFormSchemaType,
		imageFile: string
	) => {
		const result = JSON.parse(
			await updateBlogDetail(blog?.id!, data, imageFile)
		) as PostgrestSingleResponse<null>
		if (result.error) {
			toast({
				title: 'Fail to update ',
				description: (
					<div className='mt-2 border-red-400 rounded-md bg-slate-950 p-4'>
						<p className=''>{result.error?.message}</p>
					</div>
				),
			})
		} else {
			toast({
				title: 'Successfully update 🎉',
				description: (
					<div className='mt-2 border-green-400 rounded-md bg-slate-950 p-4'>
						<p className=''>Article Updated</p>
					</div>
				),
			})
			router.push('/dashboard')
		}
	}

	return <BlogForm onHandleSubmit={onHandleSubmit} defaultBlog={blog} />
}
