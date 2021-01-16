const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 255,
		},
		avatars: [{ type: Schema.Types.ObjectId, ref: 'Avatar' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
