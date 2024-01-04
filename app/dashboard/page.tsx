import DashboardTable from '@/components/blog/DashboardTable'
import { Button } from '@/components/ui/button'
import { links } from '@/lib/constants/links'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function Dashboard() {
	return (
		<div className='space-y-5'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Blogs</h1>
				<Link href={links.create}>
					<Button className='flex items-center gap-2 ' variant='outline'>
						Create <PlusIcon />
					</Button>
				</Link>
			</div>

			<DashboardTable />
		</div>
	)
}
