'use server'

import { createSupabaseServerClient } from '@/lib/supabase'
import { IBlog } from '@/lib/types'
import { revalidatePath, unstable_noStore } from 'next/cache'
import { BlogFormSchemaType } from '../../app/dashboard/blog/schema'
import { links } from '../constants/links'

const DASHBOARD = '/dashboard/blog'

export async function createBlog(
	data: {
		content: string
		title: string
		image_url: string
		is_premium: boolean
		is_published: boolean
	},
	imageFile: string
) {
	const { ['content']: excludedKey, ...blog } = data

	const supabase = await createSupabaseServerClient()
	const blogResult = await supabase
		.from('blog')
		.insert({
			title: blog.title,
			is_premium: blog.is_premium,
			is_published: blog.is_published,
			image_url: blog.image_url || imageFile,
		})
		.select('id')
		.single()

	if (blogResult.error?.message && !blogResult.data) {
		return JSON.stringify(blogResult)
	} else {
		const result = await supabase
			.from('blog_content')
			.insert({ blog_id: blogResult?.data?.id!, content: data.content })

		revalidatePath(DASHBOARD)
		return JSON.stringify(result)
	}
}

export async function readFirstBlog() {
	const supabase = await createSupabaseServerClient()

	const fixedFirstBlogId = '17744d19-5921-4f4f-9715-e990578e8828'

	return supabase
		.from('blog')
		.select('*')
		.eq('id', fixedFirstBlogId)
		.eq('is_published', true)
		.single()
}

export async function readBlogs(from: number, to: number) {
	const supabase = await createSupabaseServerClient()

	return supabase
		.from('blog')
		.select('*')
		.eq('is_published', true)
		.order('created_at', { ascending: false })
		.range(from, to)
}

export async function readBlogAdmin() {
	// await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient()
	return supabase
		.from('blog')
		.select('*')
		.order('created_at', { ascending: false })
	// .range(from, to)
}

export async function readBlogById(blogId: string) {
	const supabase = await createSupabaseServerClient()
	return supabase.from('blog').select('*').eq('id', blogId).single()
}

export async function readBlogIds() {
	const supabase = await createSupabaseServerClient()
	return supabase.from('blog').select('id')
}

export async function readBlogDetailById(blogId: string) {
	const supabase = await createSupabaseServerClient()
	return await supabase
		.from('blog')
		.select('*,blog_content(*)')
		.eq('id', blogId)
		.single()
}

export async function readBlogContent(blogId: string) {
	unstable_noStore()
	const supabase = await createSupabaseServerClient()
	return await supabase
		.from('blog_content')
		.select('content')
		.eq('blog_id', blogId)
		.single()
}

export async function updateBlogById(blogId: string, data: IBlog) {
	const supabase = await createSupabaseServerClient()
	const result = await supabase.from('blog').update(data).eq('id', blogId)
	revalidatePath(DASHBOARD)
	revalidatePath(links.blog + blogId)
	return JSON.stringify(result)
}

export async function updateBlogDetail(
	blogId: string,
	data: BlogFormSchemaType,
	imageFile: string
) {
	const { ['content']: excludedKey, ...blog } = data

	const supabase = await createSupabaseServerClient()
	const resultBlog = await supabase
		.from('blog')
		.update({
			title: blog.title,
			is_premium: blog.is_premium,
			is_published: blog.is_published,
			image_url: blog.image_url || imageFile,
		})
		.eq('id', blogId)
	if (resultBlog.error) {
		return JSON.stringify(resultBlog)
	} else {
		const result = await supabase
			.from('blog_content')
			.update({ content: data.content })
			.eq('blog_id', blogId)
		revalidatePath(DASHBOARD)
		revalidatePath(links.blog + blogId)

		return JSON.stringify(result)
	}
}

export async function deleteBlogById(blogId: string) {
	const supabase = await createSupabaseServerClient()
	const result = await supabase.from('blog').delete().eq('id', blogId)
	revalidatePath(DASHBOARD)
	revalidatePath(links.blog + blogId)
	return JSON.stringify(result)
}
