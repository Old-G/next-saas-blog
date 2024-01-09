import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const uploadFileToSupabase = async (file: File) => {
	const filePath = `${Date.now()}-${file.name}`
	const { data, error } = await supabase.storage
		.from('images')
		.upload(filePath, file)

	if (error) {
		console.error('Error upload file:', error.message)
		throw error
	}

	return data.path
}

export async function updateDatabaseWithImagePaths(
	imagePaths: string[],
	blog: any
) {
	const imagePathString = imagePaths.join(',')

	const { data, error } = await supabase
		.from('blog')
		.update({ article_images: imagePathString })
		.eq('id', blog?.id)
		.select()

	if (error) {
		throw new Error(error.message)
	}
}

export const handleFileChange = async (
	event: any,
	index: number,
	setIsUploading: any,
	blog: any,
	imagePaths: string[],
	setImagePaths: any
) => {
	const file = event.target.files[0]
	if (file) {
		setIsUploading(true)
		try {
			const filePath = await uploadFileToSupabase(file)
			const newImagePaths = [...imagePaths]
			//@ts-ignore
			newImagePaths[index] = filePath
			setImagePaths(newImagePaths)
			await updateDatabaseWithImagePaths(newImagePaths, blog)
		} catch (error) {
			console.error('Error update file:', error)
		}
		setIsUploading(false)
	}
}

export const handleMultipleFilesChange = async (
	event: any,
	setIsUploading: any,
	imagePaths: string[],
	setImagePaths: any,
	blog: any
) => {
	const selectedFiles = Array.from(event.target.files)
	const newImagePaths = [...imagePaths]

	setIsUploading(true)

	try {
		for (const file of selectedFiles) {
			//@ts-ignore
			const filePath = await uploadFileToSupabase(file)
			newImagePaths.push(filePath)
		}
		setImagePaths(newImagePaths)
		await updateDatabaseWithImagePaths(newImagePaths, blog)
	} catch (error) {
		console.error('Error handling files:', error)
	} finally {
		setIsUploading(false)
	}
}

export async function deleteImageFromSupabase(filePath: string) {
	const { error } = await supabase.storage.from('images').remove([filePath])

	if (error) {
		console.error('Error delete file: ', error.message)
		throw error
	}
}
