const register = async (accData) => {
	const response = await fetch('/api/users', {
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

	if (accData?.email.toLowerCase().includes('@test.')) {
		// there're multiple ways to implement this:
		// 1. in Slice
		// 2. directly in component
		// I choose this one because the essential task is:
		// -read email (could require jwt_decoding/store new state)
		// -so I take advatange here to access mail + localStorage could
		// -be manipulated easily (user could experience themselves)
		// -make it become more like an 'option' rather than a rule for @test.com account
		// (if want it become rule), I can attach it in authSlice --> depend on current token
		// --so reset everytime visit

		localStorage.setItem('isReversedDisplay', true);
	} else localStorage.removeItem('isReversedDisplay');

	return data;
};

const login = async (accData) => {
	const response = await fetch('/api/users/login', {
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

	if (accData?.email.toLowerCase().includes('@test.')) {
		// (copied from register() above )
		localStorage.setItem('isReversedDisplay', true);
	} else localStorage.removeItem('isReversedDisplay');

	// attach 'name' read from token to the result
	// -(later) used for update state in 'builder'
	return data;
};

const authService = { register, login };

export default authService;
