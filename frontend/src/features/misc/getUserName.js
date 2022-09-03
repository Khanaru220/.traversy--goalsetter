import jwt_decode from 'jwt-decode';

export const getUserName = (token) => {
	try {
		return jwt_decode(token)?.name;
	} catch {
		// to prevent breaking our application
		// localStorage.removeItem('userToken');
		return null;
	}
};
