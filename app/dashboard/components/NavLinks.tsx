'use client'
import { navLinks } from '@/lib/constants/links'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
	const pathname = usePathname()

	return (
		<div className='flex items-center gap-5 border-b pb-2'>
			{navLinks.map(({ href, Icon, text }, index) => {
				return (
					<Link
						href={href}
						className={cn(
							'text-sm text-gray-400 flex  items-center gap-1 hover:underline transition-all',
							{ 'text-green-500 underline': pathname === href }
						)}
						key={index}
					>
						<Icon /> / {text}
					</Link>
				)
			})}
		</div>
	)
}
