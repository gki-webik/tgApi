'use client'

import { useForm } from 'react-hook-form'
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
import { registerSchema } from '@/lib/schemas'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	})
	const router = useRouter()

	const onSubmit = async (values: any) => {
		if (Object.keys(form.formState.errors).length > 0) {
			toast.error('Заполните все поля ввода')
			return
		}

		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		})

		const data = await res.json()

		if (res.status !== 201) {
			toast.error(data.message)
		} else {
			toast.success('Вы успешно зарегистрировались')

			// После успешной регистрации войти в систему автоматически
			const signInResponse = await signIn('credentials', {
				redirect: false,
				email: values.email,
				password: values.password
			})

			// Если вход успешен, перенаправить пользователя на главную страницу
			if (signInResponse?.ok) {
				router.push('/')
			} else {
				toast.error('Ошибка при входе после регистрации')
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Имя пользователя</FormLabel>
							<FormControl>
								<Input {...field} placeholder='John' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type='email' {...field} placeholder='example@mail.com' />
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
							<FormLabel>Пароль</FormLabel>
							<FormControl>
								<Input type='password' {...field} placeholder='••••••••' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Подтверждение пароля</FormLabel>
							<FormControl>
								<Input type='password' {...field} placeholder='••••••••' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
				>
					Зарегистрироваться
				</Button>
				<p className='text-center'>
					У Вас уже есть аккаунт?{' '}
					<Link href='/signin' className='text-blue-500 hover:underline'>
						Войти
					</Link>{' '}
					в аккаунт
				</p>
			</form>
		</Form>
	)
}
