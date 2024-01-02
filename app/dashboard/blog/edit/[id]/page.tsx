import { readBlogDetailById } from '@/lib/actions/blog'
import { IBlogDetails } from '@/lib/types'
import EditForm from '../../../../../components/EditForm'

export default async function Edit({ params }: { params: { id: string } }) {
	const { data: blog } = await readBlogDetailById(params.id)
	return <EditForm blog={blog as IBlogDetails} />
}
