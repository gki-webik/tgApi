'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loginSchema } from '@/lib/schemas'
import GoogleButton from '@@/components/GoogleButton'
import TelegramWidget from '@@/components/TelegramWidget'

export default function LoginForm() {
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(loginSchema)
	})

	const onSubmit = async (values: any) => {
		const response = await signIn('credentials', {
			redirect: false,
			email: values.email,
			password: values.password
		})

		if (response?.error) {
			toast.error('Неправильный email или пароль')
			return
		}

		toast.success('Вы вошли в систему')
		router.push('/')
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-500 dark:text-gray-300'>
								Email
							</FormLabel>
							<FormControl>
								<Input
									type='email'
									{...field}
									placeholder='John'
									className='focus-visible:ring-2 bg-slate-800 focus:bg-slate-500 dark:bg-gray-800 dark:text-white border dark:border-gray-700'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-500 dark:text-gray-300'>
								Пароль
							</FormLabel>
							<FormControl>
								<Input
									type='password'
									{...field}
									placeholder='••••••••'
									className='focus-visible:ring-2 bg-slate-800 focus:bg-slate-500 dark:bg-gray-800 dark:text-white border dark:border-gray-700'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
				>
					Войти
				</Button>

				<p className='text-center text-gray-500 dark:text-gray-300'>
					Или войти с помощью
				</p>

				<div className='flex justify-center gap-10 items-center'>
					<GoogleButton />
					<TelegramWidget />
				</div>

				<p className='text-center text-gray-500 dark:text-gray-300'>
					У Вас ещё нет аккаунта?{' '}
					<a href='/signup' className='text-blue-500 hover:underline'>
						Зарегистрироваться
					</a>
				</p>
			</form>
		</Form>
	)
}
