const mongoose = require('mongoose');

// 1. define Schema
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'Please add a name'] },
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			lowercase: true,
		},
		country: String,
		password: { type: String, required: [true, 'Please add a password'] },
	},
	{ timestamps: true }
);

// 2. convert Schema to Model
// 2.1 then export (and use as collection-like syntax)
module.exports = mongoose.model('User', userSchema);
