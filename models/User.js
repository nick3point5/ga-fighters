const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
		},
		password: {
			type: String,
		},
		account: { type: String, required: true },
		avatars: [{ type: Schema.Types.ObjectId, ref: "Avatar" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
