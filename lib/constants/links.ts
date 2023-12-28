import { PersonIcon, ReaderIcon } from '@radix-ui/react-icons'

export const links = {
	home: '/',
	dashboard: '/dashboard',
	blog: '/blog/',
	create: '/dashboard/blog/create',
	edit: '/dashboard/blog/edit',
}

export const navLinks = [
	{
		href: '/dashboard',
		Icon: ReaderIcon,
		text: 'dashboard',
	},

	{
		href: '/dashboard/user',
		Icon: PersonIcon,
		text: 'users',
	},
]
