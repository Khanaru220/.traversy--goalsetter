import {
	displayAll,
	addGoal,
	reset,
	deleteGoal,
} from '../features/goals/goalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { GoalForm_forward } from '../components/GoalForm';
import GoalForm from '../components/GoalForm';
import GoalItem from '../components/GoalItem';

import { updateToast } from '../features/misc/updateToast';
import { useEffect, useState, useRef } from 'react';

function Dashboard() {
	const dispatch = useDispatch();
	const [isPageReady, setIsPageReady] = useState(false);
	// (my-self) this consider as 'state' prevent render dashboard
	// -at first mounting (while dispatch not run === isLoading not exist yet)
	// (idea) Spinner render as default (mounting)
	// -dashBoard only display/available when isSuccess/isError
	// -update value isPageReady
	// (useRef) .current so it won't be reset when re-render
	const { goals, isSuccess, isLoading, isError, message } = useSelector(
		(state) => state.goals
	);
	const { userName } = useSelector((state) => state.auth);

	useEffect(() => {
		// (?) why it re-run when modify goal (edit, add, remove,..)
		// -(Here we use [])
		// -->(BIG and BOLD answer) it not re-run
		// -displayAll, actually mean getAllGoals (only fetching data, not 'dispaly')
		// -UI update because (re-render -> re-declare 'goals' var -> component update)
		dispatch(displayAll());
	}, []);

	useEffect(() => {
		// (!) bug: don't know why sometime, notification display too much, will stop
		// -display anymore
		if (isPageReady && isLoading) {
			// not run when isLoading page (first rendering)
			// -(only run when modify goals)
			updateToast({
				toastId: 'modify_goal',
				type: 'loading',
				message: 'In progress, please wait...',
				autoClose: false,
			});
		}
	}, [isLoading]);

	useEffect(() => {
		if (isError) {
			updateToast({
				toastId: 'error_displaygoals',
				type: 'error',
				message,
			});
		}
		if (goals.length === 0 && isSuccess && message) {
			// (not) notify when register successly (first join)

			if (!toast.isActive('success_register')) {
				toast.dismiss('modify_goal');
				toast.dark('You have no goal :(', { toastId: 'success_nogoals' });
			}
			setIsPageReady(true);
		}

		if (isSuccess && message === '(hack) displayGoals') {
			// is 'displayAll' (success, but has no message)
			// care about UX:
			// + only want Spinner for loading all Goals at first
			// + modify goals not display Spinner - like Todoist
			// (!) urgly hack, what we're doing is "detecting actions base on
			// -response from server"
			// (?) need a better way to recognize whhich action is called
			// -so we can handle its isSuccess,isLoading,isError better
			setIsPageReady(true);
		}

		if (goals.length > 0 && isSuccess && message && !message.includes('hack')) {
			// (đúng rồi ha) mình đâu có cần phân biệt action nào dispatch
			// -(add,delete,...). nếu chỉ cần notify, thì tự tui nó có message mà
			updateToast({
				toastId: 'modify_goal',
				type: 'success',
				message,
				autoClose: 3000,
				isLoading: false,
			});
		}

		if (isSuccess || isError) {
			dispatch(reset());
		}
	}, [goals, isSuccess, isError, isLoading, isPageReady, message, dispatch]);

	// dispatch(deleteGoal('62ff1c8e2b6f3f0b0289392d'));

	// Dashboard order first-render is different from Login/Register
	// -Login,Register: display immediately form (not require fetching/spinner at first render)
	// -(default: Content) - (next render: Spinner)
	// -Dashboard: need fetching goals at first rendering
	// -(default: Spinner) - (next render: Content)
	if (isPageReady) {
		return (
			<>
				<section className="heading">
					<h1>
						Howdy, <span className="user-name">{userName}</span>
					</h1>
					<p>Goals Dashboard</p>
				</section>
				{/* <GoalForm_forward ref={textInputRef} /> */}
				<GoalForm />

				<section className="content">
					<div className="goals">
						{goals.map((goal, i) => (
							<GoalItem key={goal._id} goal={goal} index={goals.length - i} />
						))}
					</div>
				</section>
			</>
		);
	}

	return <Spinner />;
}
export default Dashboard;
