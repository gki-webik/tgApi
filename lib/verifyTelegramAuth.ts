import crypto from 'crypto'

export function verifyTelegramAuth(data: any) {
	const secret = crypto
		.createHash('sha256')
		.update(process.env.BOT_API_TOKEN || '')
		.digest()

	const checkString = Object.keys(data)
		.filter(key => key !== 'hash')
		.sort()
		.map(key => `${key}=${data[key]}`)
		.join('\n')

	const hash = crypto
		.createHmac('sha256', secret)
		.update(checkString)
		.digest('hex')

	return hash === data.hash
}
