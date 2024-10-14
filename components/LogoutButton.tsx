'use client'

import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

const LogoutButton = () => {
	const handleSignOut = async () => {
		await signOut({ redirect: true, callbackUrl: '/signin' })
	}

	return (
		<Button variant='destructive' onClick={handleSignOut}>
			Выйти
		</Button>
	)
}

export default LogoutButton
