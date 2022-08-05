const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	viewUser,
	deleteUser,
	viewAllUsers,
} = require('./../controllers/userController.js');
const protectRoute = require('./../middlewares/authMiddleware.js');
// -------------

// '/api/users'
// using 'controllers' for route hanlders
router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').all(protectRoute).get(viewUser).delete(deleteUser);

// development environment
router.route('/').get(viewAllUsers);

module.exports = router;
