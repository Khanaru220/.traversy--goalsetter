const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		text: { type: String, require: [true, `Please add 'text'`] },
	},
	{ timestamps: true }
);

// (from Mongoose) 'Goal' is 'model' converted from 'schema'
// to interact with database: we use model's methods
module.exports = mongoose.model('Goal', goalSchema);
