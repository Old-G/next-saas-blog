'use client'
import { useUser } from '@/lib/store/user'
import { Database } from '@/lib/types/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect } from 'react'

export default function SessionProvider() {
	const setUser = useUser(state => state.setUser)

	const supabase = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)

	useEffect(() => {
		const readSession = async () => {
			const { data: userSession } = await supabase.auth.getSession()

			if (userSession.session) {
				const { data } = await supabase
					.from('users')
					.select('*')
					.eq('id', userSession.session?.user.id)
					.single()

				setUser(data)
			}
		}

		readSession()
	}, [setUser])

	return <></>
}
