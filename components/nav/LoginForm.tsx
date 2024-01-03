'use client'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'
import { usePathname } from 'next/navigation'

export default function LoginForm() {
	const pathname = usePathname()
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)

	const getURL = () => {
		let url =
			process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
			process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
			'http://localhost:3000'
		// Make sure to include `https://` when not localhost.
		url = url.includes('http') ? url : `https://${url}`
		// Make sure to include a trailing `/`.
		url = url.charAt(url.length - 1) === '/' ? url : `${url}`
		return `${url}/auth/callback?next=${pathname}`
	}

	const handleLoginGithub = () => {
		supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: getURL(),
			},
		})
	}

	const handleLoginGoogle = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: getURL(),
			},
		})
	}

	return (
		<div className='flex flex-col md:flex-row items-center space-y-2 md:space-x-2'>
			<Button
				className='flex items-center gap-2'
				variant='outline'
				onClick={handleLoginGoogle}
			>
				Google
			</Button>
			<Button
				className='flex items-center gap-2'
				variant='outline'
				onClick={handleLoginGithub}
			>
				Github
			</Button>
		</div>
	)
}
