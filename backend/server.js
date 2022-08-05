const colors = require('colors');
const express = require('express');
const app = express();
const connectDB = require('./config/db.js');

require('dotenv').config(); // https://www.npmjs.com/package/dotenv
connectDB();
// --- body parser
app.use(express.urlencoded({ extended: true }));
// ---

// --- routes
app.use('/api/goals', require('./routes/goalRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/', require('./middlewares/errorHandler.js'));

// ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`);
});
