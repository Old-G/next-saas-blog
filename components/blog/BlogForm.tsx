'use client'

import MarkdownPreview from '@/components/markdown/MarkdownPreview'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { handleImage } from '@/lib/helpers'
import { IBlogDetails } from '@/lib/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	EyeOpenIcon,
	Pencil1Icon,
	RocketIcon,
	StarIcon,
} from '@radix-ui/react-icons'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import { useCallback, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { BsSave } from 'react-icons/bs'
import * as z from 'zod'
import {
	BlogFormSchema,
	BlogFormSchemaType,
} from '../../app/dashboard/blog/schema'

export default function BlogForm({
	onHandleSubmit,
	defaultBlog,
}: {
	defaultBlog: IBlogDetails
	onHandleSubmit: (data: BlogFormSchemaType, imageFile: string) => void
}) {
	const [isPending, startTransition] = useTransition()
	const [isPreview, setPreview] = useState(false)
	const [files, setFiles] = useState<File[]>([])
	const [uploadImage, setUploadImage] = useState<null | string>(null)

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)

	const form = useForm<z.infer<typeof BlogFormSchema>>({
		mode: 'all',
		resolver: zodResolver(BlogFormSchema),
		defaultValues: {
			title: defaultBlog?.title,
			content: defaultBlog?.blog_content.content,
			image_url: defaultBlog?.image_url,
			image_file: '',
			is_premium: defaultBlog?.is_premium,
			is_published: defaultBlog?.is_published,
		},
	})

	// `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_URL}${userState.image}`

	const onSubmit = useCallback(
		async (data: z.infer<typeof BlogFormSchema>) => {
			startTransition(async () => {
				let finalImageUrl = data.image_url // Use the existing image URL by default

				if (files.length > 0) {
					const file = files[0]
					const filePath = `${Date.now()}-${file.name}`

					const { data: uploadData, error: uploadError } =
						await supabase.storage.from('images').upload(filePath, file)

					if (uploadError) {
						console.error('Error uploading file:', uploadError)
						return
					}

					if (uploadData && uploadData.path) {
						finalImageUrl = uploadData.path // Use the new image URL
					}
				}

				onHandleSubmit(data, `${finalImageUrl}`)
			})
		},
		[files, onHandleSubmit, supabase.storage]
	)

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full border pb-5 rounded-md'
			>
				<div className='border-b p-5 flex items-center sm:justify-between flex-wrap sm:flex-row gap-2'>
					<div className='flex items-center flex-wrap gap-5'>
						<span
							onClick={() => {
								setPreview(
									!isPreview && !form.getFieldState('image_url').invalid
								)
							}}
							role='button'
							tabIndex={0}
							className='flex gap-2 items-center border px-3 py-2 rounded-md hover:border-zinc-400 transition-all text-sm'
						>
							{!isPreview ? (
								<>
									<EyeOpenIcon />
									Preview
								</>
							) : (
								<>
									<Pencil1Icon />
									Edit
								</>
							)}
						</span>
						<FormField
							control={form.control}
							name='is_premium'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex items-center gap-1 border p-2 rounded-md'>
											<StarIcon />
											<span className='text-sm'>Premium</span>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='is_published'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex items-center gap-1 border p-2 rounded-md'>
											<RocketIcon />

											<span className='text-sm'>Publish</span>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<button
						type='submit'
						role='button'
						className={cn(
							'flex gap-2 items-center border px-3 py-2 rounded-md border-green-500 bg-green-500 disabled:border-gray-800 transition-all group text-sm disabled:bg-zinc-900',
							{ 'animate-spin': isPending }
						)}
						disabled={!form.formState.isValid}
					>
						<BsSave
						// className='animate-bounce group-disabled:animate-none'
						/>
						Save
					</button>
				</div>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<>
									<div
										className={cn(
											'w-full flex break-words p-2 gap-2',
											isPreview ? 'divide-x-0' : 'divide-x'
										)}
									>
										<Input
											placeholder='Blog title'
											{...field}
											autoFocus
											className={cn(
												'border-none text-lg font-medium leading-relaxed focus:ring-1 ring-green-500',
												isPreview ? 'w-0 p-0' : 'w-full lg:w-1/2'
											)}
										/>
										<div
											className={cn(
												'lg:px-10',
												isPreview
													? 'mx-auto w-full lg:w-4/5 my-7'
													: ' w-1/2 lg:block hidden '
											)}
										>
											<h1 className='text-3xl font-bold dark:text-gray-200'>
												{form.getValues().title || 'Untittle blog'}
											</h1>
										</div>
									</div>
								</>
							</FormControl>

							{form.getFieldState('title').invalid &&
								form.getValues().title && (
									<div className='px-2'>
										<FormMessage />
									</div>
								)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='image_url'
					render={({ field }) => {
						return (
							<FormItem>
								<FormControl>
									<div
										className={cn(
											'w-full flex divide-x p-2 gap-2 items-center',
											isPreview ? 'divide-x-0' : 'divide-x',
											isPreview && !form.getValues().image_url && 'hidden'
										)}
									>
										<Input
											placeholder='🔗 Image url'
											{...field}
											className={cn(
												'border-none text-lg font-medium leading-relaxed focus:ring-1 ring-green-500 ',
												isPreview ? 'w-0 p-0' : 'w-full lg:w-1/2'
											)}
											type='url'
										/>
										<div
											className={cn(
												' relative',
												isPreview
													? 'px-0 mx-auto w-full lg:w-4/5 '
													: 'px-10 w-1/2 lg:block hidden'
											)}
										>
											{isPreview ? (
												<>
													{form.getValues().image_url && (
														<div className='w-full h-80 relative mt-10 border rounded-md'>
															<Image
																src={form.getValues().image_url || ''}
																alt='preview'
																fill
																className='object-cover object-center rounded-md'
															/>
														</div>
													)}
												</>
											) : (
												<div className='text-gray-400 flex items-center'>
													👆 click on{' '}
													<div className='flex items-center mx-2 text-white border px-3 py-2 rounded-md'>
														<EyeOpenIcon className='mr-2' /> Preview
													</div>
													to see image
												</div>
											)}
										</div>
									</div>
								</FormControl>

								<div className='px-3'>
									<FormMessage />
								</div>
							</FormItem>
						)
					}}
				/>

				<FormField
					control={form.control}
					name='image_file'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div
									className={cn(
										'w-full flex divide-x p-2 gap-2 items-center',
										isPreview ? 'divide-x-0' : 'divide-x'
									)}
								>
									<Input
										type='file'
										accept='image/*'
										placeholder='Add profile photo'
										className={cn(
											'border-none text-lg font-medium leading-relaxed focus:ring-1 ring-green-500 ',
											isPreview ? 'w-0 p-0' : 'w-full lg:w-1/2'
										)}
										onChange={e => handleImage(e, field.onChange, setFiles)}
									/>
									<div
										className={cn(
											' relative',
											isPreview
												? 'px-0 mx-auto w-full lg:w-4/5 '
												: 'px-10 w-1/2 lg:block hidden'
										)}
									>
										{isPreview && (
											<div className='w-full h-80 relative border rounded-md'>
												<Image
													src={field?.value}
													alt='preview'
													fill
													className=' object-cover object-center rounded-md'
												/>
											</div>
										)}
									</div>
								</div>
							</FormControl>

							<div className='px-3'>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='content'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div
									className={cn(
										'w-full flex p-2 gap-2 ',
										!isPreview ? 'divide-x h-70vh' : 'divide-x-0'
									)}
								>
									<Textarea
										placeholder='Blog content'
										{...field}
										className={cn(
											'border-none text-lg font-medium leading-relaxed focus:ring-1 ring-green-500  h-70vh resize-none',
											isPreview ? 'w-0 p-0' : 'w-full lg:w-1/2'
										)}
									/>
									<div
										className={cn(
											'overflow-scroll h-full',
											isPreview
												? 'mx-auto w-full lg:w-4/5 '
												: 'w-1/2 lg:block hidden'
										)}
									>
										<MarkdownPreview
											content={form.getValues().content}
											className='lg:px-10'
										/>
									</div>
								</div>
							</FormControl>

							{form.getFieldState('content').invalid &&
								form.getValues().content && <FormMessage />}
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

const ImageError = ({ src }: { src: string }) => {
	try {
		return <Image src={src} alt='' width={100} height={100} />
	} catch {
		return <h1>Invalid</h1>
	}
}
