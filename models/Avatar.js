const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		info: {
			type: String,
			default: 'Input details on the Avatar. ex: Avatar background story',
		},
		stats: {
			health: Number,
			mana: Number,
			attack: Number,
			defence: Number,
			spclAttack: Number,
			spclDefence: Number,
			exp: Number,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},

	{ timestamps: true }
);

module.exports = mongoose.model('Avatar', avatarSchema);
