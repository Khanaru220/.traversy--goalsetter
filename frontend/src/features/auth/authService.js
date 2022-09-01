const PORT = process.env.PORT || 5000;

const register = async (accData) => {
	const response = await fetch(`http://localhost/api/users`, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(accData),
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

	if (data?.token) {
		localStorage.setItem('userToken', data.token);
	}

	return data;
};

const login = async (accData) => {
	const response = await fetch(`http://localhost/api/users/login`, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(accData),
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

	if (data?.token) {
		localStorage.setItem('userToken', data.token);
	}

	// attach 'name' read from token to the result
	// -(later) used for update state in 'builder'
	return data;
};

const authService = { register, login };

export default authService;
