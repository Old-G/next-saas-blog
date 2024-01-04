import { links } from '@/lib/constants/links'
import Link from 'next/link'
import { Button } from '../ui/button'
import DeleteAlert from './DeleteAlert'

const Actions = ({ id }: { id: string }) => {
	return (
		<div className='flex items-center gap-2 flex-wrap md:flex-nowrap'>
			<Link href={`${links.blog}${id}`}>
				<Button className='flex gap-2 items-center' variant='outline'>
					{/* <EyeOpenIcon /> */}
					View
				</Button>
			</Link>

			<DeleteAlert id={id} />

			<Link href={`${links.edit}${id}`}>
				<Button className='flex gap-2 items-center' variant='outline'>
					{/* <Pencil1Icon /> */}
					Edit
				</Button>
			</Link>
		</div>
	)
}

export default Actions
