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
import PortraitCharacter from '../components/PortraitCharacter';

import { updateToast } from '../features/misc/updateToast';
import { useEffect, useState, useRef } from 'react';

function Dashboard() {
	const dispatch = useDispatch();
	const [isPageReady, setIsPageReady] = useState(false);
	const [isPageError, setIsPageError] = useState(false); //case: to different, not display spinner when error
	const isReversedDisplay = useRef(localStorage.getItem('isReversedDisplay'));
	// to decide display portrait in '/components/PortraitCharacters.jsx'
	const theme = useRef(null);
	// (my-self) this consider as 'state' prevent render dashboard
	// -at first mounting (while dispatch not run === isLoading not exist yet)
	// (idea) Spinner render as default (mounting)
	// -dashBoard only display/available when isSuccess/isError
	// -update value isPageReady
	// (useRef) .current so it won't be reset when re-render
	const { goals, isSuccess, isLoading, isError, message } = useSelector(
		(state) => state.goals
	);
	const { userName, userEmail } = useSelector((state) => state.auth);

	// (?) i still don't know how to execute an action in mounting (but do it once)
	// add class CSS for @test account
	// (only enable when visit Dashboard)

	if (isPageReady) {
		switch (userEmail) {
			case 'thekingoflovepoetry@test.vi':
				// Xuân Diệu
				// (!) important it's used in 2 cases (className + condition to choose portrait)
				theme.current = 'theme-xuandieu';
				break;
			case 'theladyofvuongfamily@test.vi':
				// Truyện Kiều
				theme.current = 'theme-truyenkieu';
				break;
			case 'theboywholived@test.uk':
				// Harry Potter
				theme.current = 'theme-harrypotter';
				break;
			case 'thewoman@test.uk':
				// Irene Adler
				theme.current = 'theme-ireneadler';
				break;
			default:
		}

		theme.current &&
			document.querySelector('body').classList.add(theme.current);
	}

	useEffect(() => {
		// (?) why it re-run when modify goal (edit, add, remove,..)
		// -(Here we use [])
		// -->(BIG and BOLD answer) it not re-run
		// -displayAll, actually mean getAllGoals (only fetching data, not 'dispaly')
		// -UI update because (re-render -> re-declare 'goals' var -> component update)
		dispatch(displayAll());
		return () => {
			// reset customize of testaccount when unmount (when click Logout)
			document.querySelector('body').classList.remove(theme.current);
		};
	}, []);

	useEffect(() => {
		isPageReady && userEmail && console.log(`You're logging as: ${userEmail}`);
	}, [isPageReady]);

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
			toast(message, {
				toastId: 'error_displaygoals',
				type: toast.TYPE.ERROR,
				// might be: 'autoClose:false' from loading
				// -overwrite: closeOnClick of Toastcontainer
				// -(confirmed) My assume is right
				closeOnClick: true,
			});
			// -------
			// updateToast({
			// 	toastId: 'error_displaygoals',
			// 	type: 'error',
			// 	message,
			// });
			// -------
			// only trigger Error display (to stop spinner) when page not render first
			// -not login succes
			!isPageReady && setIsPageError(true);
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
	return (
		<>
			<section className="heading">
				<h1>
					Howdy, <span className="user-name">{userName}</span>
				</h1>
				<p>Goals Dashboard</p>
			</section>
			{/* <GoalForm_forward ref={textInputRef} /> */}
			{userEmail.includes('@test.') ? (
				<PortraitCharacter theme={theme.current} />
			) : (
				<GoalForm />
			)}

			<section className="content">
				<div className="goals">
					{goals.map((goal, i) => {
						let numOrder = goals.length - i;

						return (
							// index=goals.length-i: hơi trớ trêu tí
							// -1. mình muốn goal mới được display trước:
							// -nên sort ascendant
							// -và dùng unshift (tức là index sẽ bị ngược chiều)
							// -2 nhưng mình cũng muốn: hiện số thứ tự của goal:
							// -nên phải làm index trở nên cùng chiều
							<GoalItem key={i} goal={goal} numOrder={numOrder} />
						);
					})}
				</div>
			</section>
		</>
	);
}
export default Dashboard;
