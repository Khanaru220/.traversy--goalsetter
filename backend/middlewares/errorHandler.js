const errorHandler = (err, req, res, next) => {
	// (fix bugs) change default response of Express: 200 -> 500 (because if it's error come to this middleware, no way it's 200)
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'development' ? err.stack : null,
	});
	// err.message
	// res.statusCode === (to over-write use) res.status || (default) passed by err.statusCode
	// err.stack

	// --- (usage in goalController.js)
	// res.status(422);
	// throw new Error('asdasd');
	// ---
};

// -----------
module.exports = errorHandler;
