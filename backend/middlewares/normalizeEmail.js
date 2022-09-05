const normalizeEmail = (req, res, next) => {
	// provide conveinive for input (upperCase if it make more readable)
	if (req.body.email) {
		req.body.email = req.body.email.toLowerCase();
	}
	next();
};

module.exports = normalizeEmail;
