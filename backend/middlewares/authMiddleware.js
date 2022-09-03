const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
// -------------
const protectRoute = asyncHandler(async (req, res, next) => {
	// 1. vefiry token from Bearer
	// 1.1 read body.header
	const bearer = req?.header('Authorization');
	if (!bearer) {
		res.status(400);
		throw new Error('Please add the Authorization in body header');
	}
	// 1.2 extract token from Bearer
	const token = bearer.split(' ')[1];
	// 1.3 verify token
	// format Authentication bearer: 'Bearer <token>'
	const decodedPayload = jwt.verify(
		token,
		process.env.JWT_SECRET,
		(err, decoded) => {
			if (err) {
				throw err;
			}
			return decoded;
		}
	);
	// 2. make sure it's real 'user'
	const user = await User.findById({ _id: decodedPayload.id }).select(
		'-password'
	);
	if (user) {
		// (true) call next()
		req.user = user;
		next();
	} else {
		// (false) res.status(401)
		res.status(401);
		throw new Error('Not authorized');
	}
});

module.exports = protectRoute;
