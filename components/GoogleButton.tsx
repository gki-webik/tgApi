'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const GoogleButton = () => {
	const handleGoogleSignIn = async () => {
		await signIn('google', { callbackUrl: '/' })
	}

	return (
		<Button
			onClick={handleGoogleSignIn}
			variant='outline'
			size='lg'
			className='flex items-center justify-between gap-2'
		>
			<Image
				src='/google-logo.svg'
				alt='Google logo'
				width={24}
				height={24}
				className='mr-2'
			/>
			<p className='text-black dark:text-white'>Google</p>
		</Button>
	)
}

export default GoogleButton
