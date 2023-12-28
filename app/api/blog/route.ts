import { supabase } from '@/lib/supabase/supabase'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)

	const id = searchParams.get('id')

	if (id === '*') {
		const result = await supabase.from('blog').select('id').limit(10)
		return Response.json({ ...result })
	} else if (id) {
		const result = await supabase.from('blog').select('*').eq('id', id).single()
		return Response.json({ ...result })
	}
	return Response.json({})
}
