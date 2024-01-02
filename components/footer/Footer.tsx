import { links } from '@/lib/constants/links'
import {
	ChatBubbleIcon,
	InstagramLogoIcon,
	PaperPlaneIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'
import HoverUnderLine from '../nav/HoverUnderLine'

export default function Footer() {
	return (
		<footer className='border-t py-5 md:py-10 max-w-7xl md:p-0 space-y-5 mx-auto flex flex-col'>
			<div className='space-y-2 '>
				<div className='w-[310px]'>
					<HoverUnderLine>
						<Link href={links.home} className='font-bold text-2xl'>
							Ginsights | Startups Daily
						</Link>
					</HoverUnderLine>
				</div>
				<p className='w-full'>
					Окунитесь в мир инноваций и предпринимательства на нашем блоге, где
					каждый пост – это ключ к пониманию мира стартапов, венчурных
					инвестиций и передовых технологий.
				</p>
			</div>
			<div className='flex flex-col md:flex-row justify-between space-y-6 md:space-y-0'>
				<div className='space-y-10'>
					<div className='flex items-center gap-3'>
						<Link href='https://t.me/ginsights' target='blank'>
							<PaperPlaneIcon className='w-5 h-5 rotate-[-45deg]' />
						</Link>
						<Link href='https://instagram.com/oldg9516' target='blank'>
							<InstagramLogoIcon className='w-5 h-5' />
						</Link>
						<Link href='https://t.me/+RgtAHo2lpH9mYTky' target='blank'>
							<ChatBubbleIcon className='w-5 h-5' />
						</Link>
						{/* <Link href='/'>
							<GitHubLogoIcon className='w-5 h-5' />
						</Link>
						<Link href='/'>
							<LinkedInLogoIcon className='w-5 h-5' />
						</Link>
						<Link href='/'>
							<DiscordLogoIcon className='w-5 h-5' />
						</Link> */}
					</div>
				</div>

				<Link href={links.oferta} className='text-nowrap'>
					Публичная оферта
				</Link>

				<Link href={links.privacyPolicy} className='text-nowrap'>
					Политика конфиденциальности
				</Link>
			</div>

			<div className='flex flex-col md:flex-row md:justify-between space-y-5 md:space-y-0 pt-10 md:pt-0'>
				<span className='text-sm text-nowrap self-start'>
					Есть вопросы? Напиши нам{' '}
					<Link
						href={'mailto:hello.ginsights@gmail.com'}
						className='underline text-green-300'
					>
						на почту
					</Link>
					.
				</span>

				<span className='text-sm text-nowrap self-start'>
					&copy; 2023 Ginsights. Все права защищены.
				</span>
			</div>
		</footer>
	)
}
