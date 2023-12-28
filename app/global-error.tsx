'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	return (
		<html>
			<head />
			<body>
				<h1>Something went wrong!</h1>
				<Button onClick={() => reset()}>Try again</Button>
			</body>
		</html>
	)
}
