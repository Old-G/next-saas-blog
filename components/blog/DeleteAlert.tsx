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
import { TrashIcon } from '@radix-ui/react-icons'
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
						<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
							<code className='text-white'>{error?.message}</code>
						</pre>
					),
				})
			} else {
				toast({
					title: 'Successfully delete 🎉',
				})
			}
		})
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='flex gap-2 items-center' variant='outline'>
					<TrashIcon />
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
