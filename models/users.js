const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		title: {
			type: String,
			unique: true,
			required: [true],
		},
		description: {
			type: String,
			unique: true,
			required: [true],
		},
	},
	{ timestamps: {} }
);

module.exports = mongoose.model('User', UserSchema);
