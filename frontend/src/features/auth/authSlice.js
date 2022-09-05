import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { getDataFromToken } from '../misc/getDataFromToken';

const userToken = localStorage.getItem('userToken');
// (?) need a page to dispaly when error throw like this one
console.log(getDataFromToken(userToken, 'name'));
const initialState = {
	userToken: userToken ? userToken : null,
	// (force checked base on 'user')
	// -because if 'token' change, website will change behaviour
	// -so we can notice this
	// -(but if) we store userName separately(localStorage)
	// -we can't not always ensure that userName is right
	// -(it change quietly)
	userName: userToken ? getDataFromToken(userToken, 'name') : '',
	userEmail: userToken ? getDataFromToken(userToken, 'email') : '',
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: '',
};

// (?)'name type_action' maybe took from authSlice's name
export const register = createAsyncThunk(
	'auth/register',
	async (user, thunkAPI) => {
		// arg (user): our data - when dispatching
		// arg (thunkAPI): built-in, has method 'rejectWithValue()'
		try {
			return await authService.register(user);
		} catch (error) {
			// 1. will reject the async call
			// 2. return value from argument
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
	try {
		return await authService.login(user);
	} catch (error) {
		// should always return same data type
		// -"fulfiled" and "reject"
		// -(so that) in 'builder' we write a consistent way
		// -to handle what we want
		return thunkAPI.rejectWithValue(error);
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset(state) {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = '';
		},
		logout(state) {
			// 1. clear localStorage - 'user'
			localStorage.removeItem('userToken');
			localStorage.removeItem('userName');
			// 2. update/reset state 'auth'
			// for current session working
			// (with reloading) it's automatic updated by empty localStorage
			state.userToken = null;
			state.userName = '';
			state.userEmail = '';
		},
	},
	extraReducers: (builder) => {
		// extraReducer: to handle async reducers called (base on 'cases')
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.message = action.payload.message;

				// 'payload' took from createThunkFunction's return
				state.userToken = action.payload.token;
				state.userName = getDataFromToken(action.payload.token, 'name');
				state.userEmail = getDataFromToken(action.payload.token, 'email');
				// (?) don't know if I should add behavior beside state-related
				// -(store localStorage, console.log). Or they should be done in different file
				// -(like authService, component...)
				// console.log(`You're loggining as: ${state.userEmail}`);
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload.message;

				state.userToken = null;
				state.userName = '';
				state.userEmail = '';
			})
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.message = action.payload.message;

				state.userToken = action.payload.token;
				state.userName = getDataFromToken(action.payload.token, 'name');
				state.userEmail = getDataFromToken(action.payload.token, 'email');
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload.message;

				state.userToken = null;
				state.userName = '';
				state.userEmail = '';
			});
	},
});

export const { reset, logout } = authSlice.actions;

export default authSlice.reducer;
