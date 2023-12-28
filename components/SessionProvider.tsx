'use client'
import { useUser } from '@/lib/store/user'
import { supabase } from '@/lib/supabase/supabase'
import { useEffect } from 'react'

export default function SessionProvider() {
	const setUser = useUser(state => state.setUser)

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
