import { icons } from '@/lib/icon'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { cn } from '@/lib/utils'
import 'highlight.js/styles/atom-one-dark.min.css'
import Image from 'next/image'
import { PiTerminalThin } from 'react-icons/pi'
import CopyButton from './CopyButton'

export default function MarkdownPreview({
	content,
	className = 'sm:p-10',
}: {
	content: string
	className?: string
}) {
	return (
		<Markdown
			className={cn(
				'dark:text-gray-200 space-y-8 text-ellipsis overflow-hidden',
				className
			)}
			rehypePlugins={[rehypeHighlight]}
			components={{
				//@ts-ignore
				p: (paragraph: { children?: boolean; node?: any }) => {
					const { node } = paragraph

					if (node.children[0].tagName === 'img') {
						const image = node.children[0]
						const metastring = image.properties.alt
						const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
						const metaWidth = metastring.match(/{([^}]+)x/)
						const metaHeight = metastring.match(/x([^}]+)}/)
						const width = metaWidth ? metaWidth[1] : '768'
						const height = metaHeight ? metaHeight[1] : '432'
						const isPriority = metastring?.toLowerCase().match('{priority}')
						const hasCaption = metastring?.toLowerCase().includes('{caption:')
						const caption = metastring?.match(/{caption: (.*?)}/)?.pop()

						return (
							<div className='w-full h-[125px] md:h-80 relative mt-10 md:border rounded-md'>
								<Image
									src={image.properties.src}
									fill
									className='object-contain md:object-cover object-center rounded-md'
									alt={alt}
									priority={isPriority}
								/>
								{hasCaption ? (
									<div className='caption' aria-label={caption}>
										{caption}
									</div>
								) : null}
							</div>
						)
					}
					return <p>{paragraph.children}</p>
				},

				h1: ({ node, ...props }) => {
					return <h1 {...props} className='text-3xl font-bold' />
				},
				h2: ({ node, ...props }) => {
					return <h1 {...props} className='text-2xl font-bold mt-10 mb-10' />
				},
				h3: ({ node, ...props }) => {
					return <h1 {...props} className='text-xl font-bold mt-10 mb-10' />
				},
				code: ({ node, className, children, ...props }) => {
					const match = /language-(\w+)/.exec(className || '')
					const id = (Math.floor(Math.random() * 100) + 1).toString()
					if (match?.length) {
						let Icon = PiTerminalThin
						const isMatch = icons.hasOwnProperty(match[1])
						if (isMatch) {
							Icon = icons[match[1] as keyof typeof icons]
						}

						return (
							<div className=' bg-gradient-dark text-gray-300 border-[0.5px] rounded-md border-zinc-500'>
								<div className='flex items-center justify-between px-5 py-2 border-b-[0.5px] border-zinc-500'>
									<div className='flex items-center gap-2'>
										<Icon />
										<p className='text-sm text-gray-400'>
											{/* @ts-ignore  */}
											{node?.data?.meta}
										</p>
									</div>
									<CopyButton id={id} />
								</div>
								<div className='overflow-x-auto w-full'>
									<div className='p-5' id={id}>
										{children}
									</div>
								</div>
							</div>
						)
					} else {
						return (
							// TODO: convert to code block
							<code
								className='text-lg break-words bg-zinc-700 px-1 rounded-sm'
								{...props}
							>
								{children}
							</code>
						)
					}
				},
			}}
		>
			{content}
		</Markdown>
	)
}
