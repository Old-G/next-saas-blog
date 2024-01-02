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

	const onHandleSubmit = async (data: BlogFormSchemaType) => {
		const result = JSON.parse(
			await updateBlogDetail(blog?.id!, data)
		) as PostgrestSingleResponse<null>
		if (result.error) {
			toast({
				title: 'Fail to update ',
				description: (
					<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
						<code className='text-white'>{result.error?.message}</code>
					</pre>
				),
			})
		} else {
			toast({
				title: 'Successfully update 🎉',
			})
			router.push('/dashboard')
		}
	}

	return <BlogForm onHandleSubmit={onHandleSubmit} defaultBlog={blog} />
}
