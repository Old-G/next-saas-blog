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
import {
	deleteImageFromSupabase,
	handleFileChange,
	updateDatabaseWithImagePaths,
} from '@/lib/helpers/blogHelpers'
import { IBlogDetails } from '@/lib/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Cross1Icon,
	EyeOpenIcon,
	Pencil1Icon,
	RocketIcon,
	StarIcon,
} from '@radix-ui/react-icons'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { BsSave } from 'react-icons/bs'
import * as z from 'zod'
import {
	BlogFormSchema,
	BlogFormSchemaType,
} from '../../app/dashboard/blog/schema'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

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
	const [imagePaths, setImagePaths] = useState([])
	const [isUploading, setIsUploading] = useState(false)
	const [numberImage, setNumberImage] = useState(0)

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
			image_url:
				defaultBlog?.image_url === ''
					? defaultBlog?.image_url
					: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${defaultBlog?.image_url}`,
			image_file: '',
			is_premium: defaultBlog?.is_premium,
			is_published: defaultBlog?.is_published,
			fileInputs: [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'fileInputs',
	})

	const onSubmit = async (data: z.infer<typeof BlogFormSchema>) => {
		startTransition(async () => {
			let finalImageUrl = data.image_url
			if (files.length > 0) {
				const file = files[0]
				const filePath = `${Date.now()}-${file.name}`
				const { data: uploadData, error: uploadError } = await supabase.storage
					.from('images')
					.upload(filePath, file)

				if (uploadError) {
					console.error('Error uploading file:', uploadError)
					return
				}

				if (uploadData && uploadData.path) {
					finalImageUrl = uploadData.path
				}
			}

			const submitData = { ...data }
			delete submitData.fileInputs

			onHandleSubmit(submitData, `${finalImageUrl}`)
		})
	}

	const handleRemoveFile = async (index: number) => {
		const filePath = imagePaths[index]
		if (!filePath) {
			console.error('Path to file not found')
			return
		}

		setIsUploading(true)
		try {
			await deleteImageFromSupabase(filePath)

			const updatedImagePaths = imagePaths.filter((_, i) => i !== index)
			setImagePaths(updatedImagePaths)

			await updateDatabaseWithImagePaths(updatedImagePaths, defaultBlog)

			remove(index)
			setImagePaths(prev => prev.filter((_, i) => i !== index))
		} catch (error) {
			console.error('Error delete file:', error)
		}
		setIsUploading(false)
	}

	const copyToClipboard = async (num: number) => {
		try {
			const index = num - 1
			const imagePath = imagePaths[index]

			if (imagePath) {
				const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${imagePath}`
				const markdownString = `![AltText {768x432}{priority}{caption: Image by Something}](${imageUrl})`
				await navigator.clipboard.writeText(markdownString)
				toast({
					title: 'Successfully copied!',
				})
			} else {
				console.error('No image found for the provided index')
			}
		} catch (err) {
			console.error('Failed to copy: ', err)
		}
	}

	const handleNumberChange = async (event: any) => {
		try {
			setNumberImage(event.target.value)
		} catch (error) {
			console.error('Error number change')
		}
	}

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
											'w-full flex break-words p-2 gap-2'
											// isPreview ? 'divide-x-0' : 'divide-x'
										)}
									>
										<Input
											placeholder='Blog title'
											{...field}
											autoFocus
											className={cn(
												'border text-lg font-medium leading-relaxed focus:ring-1 ring-green-500',
												isPreview ? 'w-0 p-0 hidden' : 'w-full lg:w-1/2'
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
												{form.getValues().title || 'Untitled blog'}
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
											'w-full flex p-2 gap-2 items-center',
											// isPreview ? 'divide-x-0' : 'divide-x',
											isPreview && !form.getValues().image_url && 'hidden'
										)}
									>
										<Input
											placeholder='🔗 Image url'
											{...field}
											className={cn(
												'border text-lg font-medium leading-relaxed focus:ring-1 ring-green-500 ',
												isPreview ? 'w-0 p-0 hidden' : 'w-full lg:w-1/2'
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
														<div className='w-[300px] h-[300px] md:w-full md:h-[1000px] mx-auto relative mt-10 border rounded-md'>
															<Image
																src={
																	`${
																		process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL
																	}${form.getValues().image_url}` || ''
																}
																alt='preview-img'
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
										'w-full flex p-2 gap-2 items-center',
										// isPreview ? 'divide-x-0' : 'divide-x',
										isPreview && !form.getValues().image_file && 'hidden'
									)}
								>
									<Input
										type='file'
										accept='image/*'
										placeholder='Add image'
										className={cn(
											'border text-lg font-medium leading-relaxed focus:ring-1 ring-green-500 ',
											isPreview ? 'w-0 p-0 hidden' : 'w-full lg:w-1/2'
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
										{isPreview && field?.value && (
											<div className='w-[300px] h-[300px] md:w-full md:h-[1000px] mx-auto relative border rounded-md'>
												<Image
													src={field?.value}
													alt='preview-file'
													fill
													className='object-cover object-center rounded-md'
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

				{/* <FormField
					control={form.control}
					name='image_file'
					render={({ field }) => (
						
					)}
					/> */}
				{!isPreview && (
					<div className='space-y-3 mr-16 mb-4 mx-2 flex flex-col'>
						<label htmlFor=''>Article Images</label>
						{fields.map((field, index) => (
							<div key={field.id} className='flex items-center'>
								<Input
									type='file'
									placeholder='Choose Image'
									{...form.register(`fileInputs.${index}` as const)}
									className={cn(
										'border text-lg font-medium leading-relaxed focus:ring-1 ring-green-500 mr-2',
										isPreview ? 'w-0 p-0 hidden' : 'w-full lg:w-1/2'
									)}
									onChange={e =>
										handleFileChange(
											e,
											index,
											setIsUploading,
											defaultBlog,
											imagePaths,
											setImagePaths
										)
									}
								/>
								<button
									type='button'
									disabled={isUploading}
									onClick={() => handleRemoveFile(index)}
								>
									<Cross1Icon />
								</button>
							</div>
						))}
						<Button
							type='button'
							onClick={() => append('')}
							className='p-2 border rounded-md mb-4 w-[85px]'
							disabled={isUploading}
						>
							{isUploading ? 'Wait...' : 'Add File'}
						</Button>
					</div>
				)}

				{!isPreview && (
					<div className='space-y-4 mr-16 mb-4 ml-2 flex flex-col'>
						<Input
							type='number'
							placeholder='Number of image'
							onChange={e => handleNumberChange(e)}
							className={cn(
								'border text-lg font-medium leading-relaxed focus:ring-1 ring-green-500',
								isPreview ? 'w-0 p-0 hidden' : 'w-full lg:w-1/2'
							)}
						/>
						<Button
							type='button'
							className='w-[200px]'
							onClick={() => copyToClipboard(numberImage)}
						>
							Copy ![AltText
						</Button>
					</div>
				)}

				<FormField
					control={form.control}
					name='content'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div
									className={cn(
										'w-full flex p-2 gap-2 '
										// !isPreview ? 'divide-x h-70vh' : 'divide-x-0'
									)}
								>
									<Textarea
										placeholder='Blog content'
										{...field}
										className={cn(
											'border text-lg font-medium leading-relaxed focus:ring-1 ring-green-500  h-70vh resize-none',
											isPreview ? 'w-0 p-0 hidden' : 'w-full lg:w-1/2'
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
