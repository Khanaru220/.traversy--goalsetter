import jwt_decode from 'jwt-decode';

export const getDataFromToken = (token, propName) => {
	try {
		return jwt_decode(token)?.[propName];
	} catch {
		// to prevent breaking our application
		// localStorage.removeItem('userToken');
		return null;
	}
};
