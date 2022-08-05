const mongoose = require('mongoose');
// ---------------

// run it in the beginning at 'server.js'
// connect with MongoAtlas
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI); // a Promise method
		console.log(
			`Mongo connected to ${conn.connection.host} | database:${conn.connection.name}`
				.cyan.underline
		);
	} catch (e) {
		// handle error myself
		console.log(e);
		process.exit(1);
	}
};

module.exports = connectDB;
