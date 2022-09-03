const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// ---------------
// @desc   register user
// @route  GET /api/users
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
	// 1. (set in userModel) check "is Email unique"
	// 2. (set in userModel) required fields
	// 3. hash password
	if (!req.body.password) {
		res.status(400);
		throw new Error(`Please add the 'password' -- from controller`);
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	// 3.1 create User to database
	try {
		const user = await User.create({
			...req.body,
			password: hashedPassword,
		});

		// 4. response to client, without password
		res.json({
			message: 'Adding user successfuly',
			user: {
				id: user._id,
				// let client decode token to get 'name'
				_name: user.name,
				email: user.email,
				country: user.country,
			},
			token: generateToken(user._id, {
				name: user.name,
			}),
		});
		// res.json(user.name._doc);
		// 4.1 attach "token" to response
	} catch (e) {
		if (
			(e.name === 'MongoServerError' && e.code === 11000) ||
			e.name === 'ValidationError'
		) {
			// (error duplicate) = MongoServerError + 11000
			// (error validate input) =  ValidationError
			res.status(400);
		}
		next(e);
	}
});

// @desc   add a new user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res, next) => {
	// check empty body's request
	if (!req.body?.email || !req.body?.password) {
		res.status(400);
		throw new Error(`'email' and 'password' are required -- from controller`);
	}

	// find with 'email' in database
	const user = await User.findOne({ email: req.body.email }); // create document (match with schema)
	if (!user) {
		res.status(400);
		throw new Error(`Email isn't registered yet`);
	}

	// match 'password'
	const isMatched = await bcrypt.compare(req.body.password, user.password);
	if (!isMatched) {
		res.status(400);
		throw new Error(`Wrong password`);
	} else {
		// 4.1 attach "token" to response
		res.json({
			message: `Welcome back, ${user.name}. Token will expire in ${hoursExpire} hours`,
			token: generateToken(user._id, {
				name: user.name,
			}),
		});
	}
});

// @desc   view current user's info
// @route  GET /api/goals/me
// @access Private
const viewUser = asyncHandler(async (req, res, next) => {
	res.json(req.user);
});

// @desc   delete current user
// @route  DELETE /api/goals/me
// @access Private
const deleteUser = asyncHandler(async (req, res, next) => {
	await User.deleteOne({ _id: req.user._id });
	res.json({ message: `Account ${req.user.email} has been deleted` });
});

// @desc   display all users
// @route  GET /api/users
// @access Private(only in Dev mode)
const viewAllUsers = asyncHandler(async (req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		const users = await User.find().sort({ createdAt: -1 }); // return all documents
		res.json(users);
	} else {
		throw new Error('Only available in Dev mode');
	}
});

// ultility, generate token for register + login
const hoursExpire = 1;
const generateToken = (id, payload = {}) => {
	const token = jwt.sign({ id, ...payload }, process.env.JWT_SECRET, {
		expiresIn: `${hoursExpire}h`,
	});
	return token;
};

// ---------------
module.exports = {
	registerUser,
	loginUser,
	viewUser,
	deleteUser,
	viewAllUsers,
};
