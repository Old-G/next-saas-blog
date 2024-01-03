'use client'
import { links } from '@/lib/constants/links'
import { useUser } from '@/lib/store/user'
import Image from 'next/image'
import Link from 'next/link'
import HoverUnderLine from './HoverUnderLine'
import LoginForm from './LoginForm'
import Profile from './Profile'

export default function Navbar() {
	const user = useUser(state => state.user)

	return (
		<nav className='w-full justify-between items-center flex p-5 xl:p-0'>
			<HoverUnderLine>
				<Link
					href={links.home}
					className='font-bold text-2xl flex items-center space-x-2'
				>
					<Image
						src={'/assets/images/logo-gi.png'}
						alt='logo'
						width={50}
						height={50}
					/>
					<h2>Ginsights</h2>
				</Link>
			</HoverUnderLine>
			{user ? <Profile /> : <LoginForm />}
		</nav>
	)
}
