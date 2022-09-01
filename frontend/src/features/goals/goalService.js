const PORT = process.env.PORT || 5000;

// user's token to enable protected routes
// -can't use Hook (only called in top-level component)
// -(?) is there another way to read Redux data

const displayAll = async (token) => {
	//(?) i can conditioning empty 'user' here, but why not let it
	// -handle by B.E
	const response = await fetch(`http://localhost:${PORT}/api/goals`, {
		headers: {
			Authorization: 'Bearer' + ' ' + token,
		},
	});
	const data = await response.json();

	if (
		String(response.status).length === 3 &&
		String(response.status)[0] !== '2'
	) {
		// self-created my error object to handle request out range 2xx
		throw {
			// catch later (in authSlice's thunk)
			status: response.status,
			message: data.message || response.statusText,
		};
	}

	// data contain {goals, message}
	return data;
};

const addGoal = async (text, token) => {
	//(?) i can conditioning empty 'user' here, but why not let it
	// -handle by B.E
	const response = await fetch(`http://localhost:${PORT}/api/goals`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer' + ' ' + token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text }),
	});
	const data = await response.json();

	if (
		String(response.status).length === 3 &&
		String(response.status)[0] !== '2'
	) {
		// self-created my error object to handle request out range 2xx
		throw {
			// catch later (in authSlice's thunk)
			status: response.status,
			message: data.message || response.statusText,
		};
	}

	return data;
};

const deleteGoal = async (goalId, token) => {
	//(?) i can conditioning empty 'user' here, but why not let it
	// -handle by B.E
	const response = await fetch(`http://localhost:${PORT}/api/goals/${goalId}`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Bearer' + ' ' + token,
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();

	if (
		String(response.status).length === 3 &&
		String(response.status)[0] !== '2'
	) {
		// self-created my error object to handle request out range 2xx
		throw {
			// catch later (in authSlice's thunk)
			status: response.status,
			message: data.message || response.statusText,
		};
	}

	return data;
};

const goalService = { displayAll, addGoal, deleteGoal };
export default goalService;
