import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from './goalService';

const initialState = {
	goals: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	message: '',
};

// Display all goals of current user
export const displayAll = createAsyncThunk(
	'goals/displayAll',
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.userToken;
			return await goalService.displayAll(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

// Add a new goal
export const addGoal = createAsyncThunk('goals/add', async (text, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.userToken;
		return await goalService.addGoal(text, token);
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

// Delete a goal
export const deleteGoal = createAsyncThunk(
	'goals/delete',
	async (goalId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.userToken;
			return await goalService.deleteGoal(goalId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

const goalSlice = createSlice({
	name: 'goals',
	initialState,
	reducers: {
		reset(state) {
			state.isLoading = false;
			state.isSuccess = false;
			state.isError = false;
			state.message = '';
		},
	},
	extraReducers(builder) {
		builder
			.addCase(displayAll.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(displayAll.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;

				state.message = action.payload.message;
			})
			.addCase(displayAll.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;

				// I define one message when no goals
				state.message = action.payload.message;
				state.goals = action.payload.goals;
			})
			.addCase(addGoal.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addGoal.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;

				state.message = action.payload.message;
			})
			.addCase(addGoal.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;

				// I define one message when no goals
				state.message = action.payload.message;
				// (update offline) after add goal to server success
				//-immediately update Redux state
				//-(instead) fetching once more time to update newsest data
				state.goals.unshift(action.payload.goal);
			})
			.addCase(deleteGoal.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteGoal.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;

				state.message = action.payload.message;
			})
			.addCase(deleteGoal.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;

				state.message = action.payload.message;

				const indexElRemoved = state.goals.findIndex(
					(el) => el._id === action.payload.id
				);
				state.goals = state.goals
					.slice(0, indexElRemoved)
					.concat(state.goals.slice(indexElRemoved + 1));

				state.goals = state.goals.filter(
					(goal) => goal._id !== action.payload.id
				);
			});
	},
});

export const { reset } = goalSlice.actions;
export default goalSlice.reducer;
