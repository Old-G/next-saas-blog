import Footer from '@/components/footer/Footer'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className='min-h-[calc(100vh-130px)] flex flex-col justify-between'>
			{children}
			<Footer />
		</div>
	)
}
