import UserModel from '@@/models/user' // Переименовали модель, чтобы избежать конфликтов
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { Account, Profile, User } from 'next-auth' // Используем User и другие типы NextAuth
import dbConnect from '@@/lib/mongodb'

export const authOptions = {
	pages: {
		signIn: '/signin'
	},
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			authorize: async credentials => {
				await dbConnect()

				const user = await UserModel.findOne({ email: credentials?.email })

				if (user) {
					// Прямая проверка без хэширования, вы уже упоминали, что хэширование отключено
					const isValidPassword = user.password === credentials?.password
					if (isValidPassword) {
						return user // Возвращаем пользователя, если пароль верен
					}
				}
				return null
			}
		}),
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET
		})
	],
	callbacks: {
		async jwt({
			token,
			account,
			profile,
			user,
			trigger,
			isNewUser
		}: {
			token: JWT
			account?: Account | null
			profile?: Profile | null
			user?: User | null
			trigger?: 'signIn' | 'signUp' | 'update'
			isNewUser?: boolean
		}) {
			console.log('JWT Callback: ', token, user)

			await dbConnect()

			// Обработка пользователей Google
			if (account?.provider === 'google' && profile) {
				const existingUser = await UserModel.findOne({ email: profile.email })

				if (!existingUser && profile.email) {
					const newUser = await UserModel.create({
						name: profile.name,
						email: profile.email,
						provider: 'google'
					})

					token.id = newUser._id.toString() // Преобразуем ObjectId в строку
					token.email = newUser.email
					token.name = newUser.name
				} else if (existingUser) {
					token.id = existingUser._id.toString() // Преобразуем ObjectId в строку
					token.email = existingUser.email
					token.name = existingUser.name
				}
			}

			if (user) {
				const userId = user.id
				if (userId) {
					token.id = userId.toString()
				}
				token.email = user.email
				token.name = user.name
			}

			return token
		},

		async session({ session, token }: { session: any; token: JWT }) {
			console.log('Session Callback: ', session, token)

			session.user.id = token.id // Добавляем id пользователя в сессию
			session.user.email = token.email
			session.user.name = token.name

			return session // Возвращаем измененную сессию
		}
	},
	jwt: {
		secret: process.env.AUTH_SECRET, // Убедитесь, что secret присутствует
		maxAge: 30 * 24 * 60 * 60 // JWT срок действия - 30 дней
	}
}

// Экспортируем функции
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
