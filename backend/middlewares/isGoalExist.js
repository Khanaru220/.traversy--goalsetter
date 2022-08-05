const Goal = require('../models/goalModel.js');
const asyncHandler = require('express-async-handler');
// -------
// run in 'ALL /api/goals/:id'
const isGoalExist = asyncHandler(async (req, res, next) => {
	const goal = await Goal.findOne({
		user: req.user._id,
		_id: req.params.id,
	});

	// how findById check
	// (1) if 'id' param is valid: isValidObjectId --> throw error if not
	// (2) return 'null' if not found
	if (!goal) {
		res.status(400);
		throw new Error(
			`Goal not found. View your current goals by GET /api/goals/`
		);
	} else {
		req.goal = goal;
		next();
	}
});

module.exports = isGoalExist;
