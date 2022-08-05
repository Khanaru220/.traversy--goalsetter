// --- version without asyncHandler, for EVERY functions we need to throw error
// const displayGoals = async (req, res, next) => {
// 	try {
// 		const goals = await Goal.find();
// 		console.log(goals);
// 		res.json({ message: 'Display all goals' });
// 	} catch (e) {
// 		next(e);
// 	}
// };
// ---
const asyncHandler = require('express-async-handler');
const Goal = require('./../models/goalModel.js');
// ---------------

// @desc   goals of current users
// @route  GET /api/goals
// @access Private
const displayGoals = asyncHandler(async (req, res, next) => {
	const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 }); // return all documents
	if (goals.length === 0) {
		res.json({ message: 'You have no goal :*( ' });
	} else {
		res.json(goals);
	}
});

// @desc   add a new goal
// @route  POST /api/goals
// @access Private
const addGoal = asyncHandler(async (req, res, next) => {
	// check empty body's request
	if (!req.body?.text) {
		res.status(400);
		throw new Error(`Please add the 'text' -- from controller`);
	}
	try {
		const goal = await Goal.create({ user: req.user._id, ...req.body }); // create document (match with schema)
		res.json({ message: 'New goal was added', goal });
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

// @desc   update a goal
// @route  PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res, next) => {
	// check is request's body empty
	if (!req.body.text) {
		res.status(400);
		throw new Error(`Please add the 'text' field`);
	}

	// findOneAndUpdate offer show updatedDocument (user document.update() doesn't return that)
	const updatedGoal = await Goal.findOneAndUpdate(
		{
			user: req.user._id,
			_id: req.params.id,
		},
		req.body,
		{ new: true }
	).select('-user -_id');

	// (1) if 'id' param is valid: isValidObjectId --> throw error if not
	// (2) return 'null' if not found
	if (!updatedGoal) {
		res.status(400);
		throw new Error(
			`Goal not found. View your current goals by GET /api/goals/`
		);
	} else {
		res.json({
			message: 'Successfully update',
			updatedGoal,
		});
	}
});

// @desc   delete a goal
// @route  DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res, next) => {
	// findOneAndUpdate offer show updatedDocument (user document.update() doesn't return that)
	const deletedGoal = await Goal.findOneAndDelete({
		user: req.user._id,
		_id: req.params.id,
	});

	// (1) if 'id' param is valid: isValidObjectId --> throw error if not
	// (2) return 'null' if not found
	if (!deletedGoal) {
		res.status(400);
		throw new Error(
			`Goal not found. View your current goals by GET /api/goals/`
		);
	} else {
		res.json({
			message: `Goal ${req.params.id} was deleted`,
		});
	}
});

// @desc   display all goals
// @route  GET /api/goals/all
// @access Private(only in Dev mode)
const displayAllGoals = asyncHandler(async (req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		const goals = await Goal.find().sort({ createdAt: -1 }); // return all documents
		if (goals.length === 0) {
			res.json({ message: 'You have no goal :*( ' });
		} else {
			res.json(goals);
		}
	} else {
		throw new Error('Only available in Dev mode');
	}
});
// ---------------

module.exports = {
	displayGoals,
	addGoal,
	updateGoal,
	deleteGoal,
	displayAllGoals,
};
