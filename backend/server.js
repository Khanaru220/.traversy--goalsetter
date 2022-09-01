const path = require('path');
const colors = require('colors');
const express = require('express');
const app = express();
const connectDB = require('./config/db.js');
const cors = require('cors');

app.use(cors());

require('dotenv').config(); // https://www.npmjs.com/package/dotenv
connectDB();
// --- body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => {
	console.log(req.rawHeaders);
	console.log('URL:', req.url);
	console.log('METHOD:', req.method);
	console.log('BODY:', req.body);
	next();
});
// ---

// --- routes
app.use('/api/goals', require('./routes/goalRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/', require('./middlewares/errorHandler.js'));

// --- Serve frontend in 'production'
// (note) write this below all previous routes
// -(?) don't know how express.static() +.sendFile() work
if (process.env.NODE_ENV === 'production') {
	// (i assume) 'static' mean Express server treat React app as a (UI, middle-man, interact for user)
	// -(in dev mode) we need run React on server, because that's create-react-app's method
	// -(in reality) the final React app is just a normal html/css/js, can be static, and run offline
	// -(online, internet) only need for fetching, request purpose
	// -(what server need from UI) is Listenning action users (submit, click, visit), then send request to server
	app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

	// '*' universal symbol means "beside any route before"
	// -(a kind of) 404 page
	// -return index.html in 'build' folder
	app.get('*', (req, res) =>
		res.sendFile(
			path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
		)
	);
} else {
	// (i assume) it's useful when start server offline (development)
	// -(but forget) then visit it on browser
	app.get('*', (req, res) => {
		res.send('Please try it again on PRODUCTION mode');
	});
}

// ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`);
});
