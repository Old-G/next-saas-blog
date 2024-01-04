import { ChangeEvent } from 'react'

export const handleImage = (
	e: ChangeEvent<HTMLInputElement>,
	fieldChange: (value: string) => void,
	setFiles: (value: File[]) => void
) => {
	e.preventDefault()

	const fileReader = new FileReader()

	if (e.target.files && e.target.files.length > 0) {
		const file = e.target.files[0]

		setFiles(Array.from(e.target.files))

		if (!file.type.includes('image')) return

		fileReader.onload = async event => {
			const imageDataUrl = event.target?.result?.toString() || ''

			fieldChange(imageDataUrl)
		}

		fileReader.readAsDataURL(file)
	}
}

export function normalizeImageUrl(imagePath: string) {
	if (imagePath.startsWith('http')) {
		return imagePath
	} else {
		return `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${imagePath}`
	}
}

export const getFromAndTo = (page: number) => {
	const itemPerPage = 8

	let from = page * itemPerPage
	let to = from + itemPerPage - 1

	return { from, to }
}
