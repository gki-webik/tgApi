import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IUser extends Document {
	_id: Types.ObjectId // Поле ObjectId для MongoDB
	name: string
	email?: string
	password?: string
	provider: string
	telegramId?: string
}

const UserSchema: Schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		sparse: true
	},
	password: {
		type: String
	},
	telegramId: {
		type: String,
		unique: true,
		sparse: true
	},
	provider: {
		type: String,
		default: 'credentials'
	}
})

const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
