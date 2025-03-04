export type IBlog = {
	id: string
	title: string
	image_url: string
	created_at: string
	is_premium: boolean
	content: string
	is_published: boolean
}

export type IBlogDetails = {
	created_at: string
	id: string
	image_url: string
	is_premium: boolean
	is_published: boolean
	title: string
	blog_content: {
		blog_id: string
		content: string
		created_at: string
	}
} | null

export type IBlogForm = {
	created_at: string
	id: string
	image_url: string
	is_premium: boolean
	is_published: boolean
	title: string
	blog_content: {
		blog_id: string
		content: string
		created_at: string
	}
}

export type IUser = {
	created_at: string
	display_name: string
	email: string
	id: string
	image_url: string
	role: string
	stripe_customer_id: string | null
	stripe_subscription_id: string | null
	subscription_status: boolean
} | null
