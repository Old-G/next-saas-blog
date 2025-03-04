'use client'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { ChangeEvent, useTransition } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { deleteBlogById } from '../../lib/actions/blog'

export default function DeleteAlert({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition()

	const onDelete = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		startTransition(async () => {
			const { error } = JSON.parse(
				await deleteBlogById(id)
			) as PostgrestSingleResponse<null>
			if (error) {
				toast({
					title: 'Fail to update ',
					description: (
						<div className='mt-2 border-red-400 rounded-md bg-slate-950 p-4'>
							<p className=''>{error.message}</p>
						</div>
					),
				})
			} else {
				toast({
					title: 'Successfully delete 🎉',
					description: (
						<div className='mt-2 border-green-400 rounded-md bg-slate-950 p-4'>
							<p className=''>Article Deleted</p>
						</div>
					),
				})
			}
		})
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='flex gap-2 items-center' variant='outline'>
					{/* <TrashIcon /> */}
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						article and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form onSubmit={onDelete}>
						<Button className='flex gap-2 items-center'>
							<AiOutlineLoading3Quarters
								className={cn(' animate-spin ', {
									hidden: !isPending,
								})}
							/>{' '}
							Continue
						</Button>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
