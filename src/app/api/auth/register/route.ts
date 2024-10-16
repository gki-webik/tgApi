import { NextRequest, NextResponse } from 'next/server'
import User from '@@/models/user'
import { verifyTelegramAuth } from '@@/lib/verifyTelegramAuth'
import dbConnect from '@@/lib/mongodb'

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const queryParams = Object.fromEntries(url.searchParams.entries())

		console.log('Запрос с параметрами: ', queryParams)

		// Верификация данных от Telegram
		const isValid = verifyTelegramAuth(queryParams)
		console.log('Результат верификации: ', isValid)

		if (!isValid) {
			console.log('Ошибка: не прошел верификацию.')
			return NextResponse.json(
				{ message: 'Ошибка при проверке данных от Telegram' },
				{ status: 400 }
			)
		}

		console.log('Подключение к MongoDB...')
		await dbConnect()
		console.log('Подключение к MongoDB выполнено')

		let user = await User.findOne({ telegramId: queryParams.id })
		console.log('Результат поиска пользователя: ', user)

		if (!user) {
			console.log('Пользователь не найден, создаю нового пользователя.')
			user = new User({
				name: queryParams.first_name,
				telegramId: queryParams.id,
				provider: 'telegram'
			})
			await user.save()
			console.log('Пользователь создан: ', user)
		}

		console.log('Возвращаю успешный ответ')
		return NextResponse.json({
			message: 'Авторизация через Telegram успешна',
			user
		})
	} catch (error) {
		console.error('Ошибка при обработке запроса: ', error)
		return NextResponse.json(
			{ message: 'Произошла ошибка при аутентификации через Telegram', error },
			{ status: 500 }
		)
	}
}
