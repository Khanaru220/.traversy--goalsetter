const express = require('express');
const router = express.Router();
const {
	displayGoals,
	addGoal,
	updateGoal,
	deleteGoal,
	displayAllGoals,
} = require('./../controllers/goalController.js');
const protectRoute = require('./../middlewares/authMiddleware.js');
const isGoalExist = require('./../middlewares/isGoalExist.js');
// -------------

// /api/goals
// using 'controllers' for route hanlders
router.route('/').all(protectRoute).get(displayGoals).post(addGoal);

// only in Development enviroment
router.route('/all').get(displayAllGoals); // (!) issue, '/:id' also catch sub-path of this

router
	.route('/:id')
	.all(protectRoute)
	.all(isGoalExist)
	.put(updateGoal)
	.delete(deleteGoal);

module.exports = router;
