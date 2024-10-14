import { NextResponse } from 'next/server'
import User from '@@/models/user'
import dbConnect from '@@/lib/mongodb'

export async function POST(req: Request) {
	try {
		await dbConnect()
		const body = await req.json()
		const { name, email, password } = body

		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: 'Заполните все обязательные поля' },
				{ status: 400 }
			)
		}

		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return NextResponse.json(
				{ message: 'Этот email уже зарегистрирован' },
				{ status: 400 }
			)
		}

		const newUser = await User.create({
			name,
			email,
			password,
			provider: 'credentials'
		})

		return NextResponse.json(
			{ message: 'Пользователь успешно зарегистрирован', newUser },
			{ status: 201 }
		)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ message: 'Ошибка при регистрации', error },
			{ status: 500 }
		)
	}
}
