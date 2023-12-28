'use client'
import { links } from '@/lib/constants/links'
import { useUser } from '@/lib/store/user'
import Link from 'next/link'
import HoverUnderLine from './HoverUnderLine'
import LoginForm from './LoginForm'
import Profile from './Profile'

export default function Navbar() {
	const user = useUser(state => state.user)

	return (
		<nav className='w-full justify-between items-center flex p-5 xl:p-0'>
			<HoverUnderLine>
				<Link href={links.home} className='font-bold text-2xl'>
					Ginsights
				</Link>
			</HoverUnderLine>
			{user ? <Profile /> : <LoginForm />}
		</nav>
	)
}
