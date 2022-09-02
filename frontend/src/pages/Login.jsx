import { useState, useEffect, useRef } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

import { reset, login } from '../features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateToast } from '../features/misc/updateToast';
import Spinner from '../components/Spinner';

const delayTime = process.env.REACT_APP_DELAY_LOADING;
const supportFocusSize = process.env.REACT_APP_SUPPORT_FOCUS_SCREEN_SIZE;
console.log(supportFocusSize);
function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [UILoading, setUILoading] = useState(false);

	const [emailInput, passInput] = [useRef(), useRef()];
	const [focusOnEmail, focusOnPassword] = [useRef(), useRef()];
	const prevMessage = useRef('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userToken, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.auth
	);
	const { email, password } = formData;

	useEffect(() => {
		focusOnEmail.current = () => {
			emailInput.current?.focus();
		};
		focusOnPassword.current = () => {
			passInput.current?.focus();
		};

		focusOnEmail.current();
	}, []);

	useEffect(() => {
		// (!) the reason it didn't work. 'Message' come at the time of 'loading'
		// -nothing to focus (only <Spinner/>)
		// -at the end of current session. isError will reset
		// -element now mounting (but 'message' is gone)
		// (!) urgly hack. I suppose there's better logic to display <Spinner/> <Dashboard/>
		if (prevMessage.current.toLowerCase().includes('password')) {
			// (!) lẽ ra chỗ này vẫn bị lỗi, prevMessage cập nhật/reset ko kịp
			// -khiến focus bị giật 1 nhịp
			// -(hack) bằng cách lấp liếm <Spinner/>
			focusOnPassword.current();
		} else if (prevMessage.current) {
			focusOnEmail.current();
		}

		if (!(isError || isSuccess)) return; //guard-clause

		setTimeout(() => {
			// to sync time with isPageReady when success/fail
			if (isError) {
				updateToast({
					toastId: 'error_login',
					type: 'error',
					message,
				});
			}
			if (userToken) {
				toast.dismiss('error_login');

				if (isSuccess) {
					// (has notify) reducer finish --> message exist
					toast.success(message, { toastId: 'success_login' });
				}
				//(no-notify)  redirect (user && !isSuccess)
				//--> only has 'user', doesn't have 'message'

				navigate('/');
			}
		}, delayTime - 100);

		if (isSuccess) {
			dispatch(reset());
		} else if (isError) {
			prevMessage.current = message; // used in focus logic after reset -> element mounting
			// (?) why success doesn't need that <-- because success doesn't require focus
			dispatch(reset());
		}
	}, [
		userToken,
		UILoading,
		isSuccess,
		isError,
		message,
		dispatch,
		navigate,
		,
	]);

	useEffect(() => {
		if (isLoading) {
			setUILoading(true);
		} else {
			setTimeout(() => {
				setUILoading(false);
			}, delayTime);
		}
	}, [isLoading]);

	const onChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};
	const onSubmit = (e) => {
		e.preventDefault();
		dispatch(login({ email, password }));
	};

	if (UILoading) {
		return <Spinner />;
	}

	return (
		<>
			<section className="heading">
				<h1>
					<FaSignInAlt />
					Login
				</h1>
				<p>Log in and start setting goals</p>
			</section>
			<section className="form">
				<form onSubmit={onSubmit}>
					<div className="form-group">
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							placeholder="Enter your email"
							onChange={onChange}
							ref={window.screen.width >= supportFocusSize ? emailInput : null}
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							placeholder="Enter password"
							onChange={onChange}
							ref={window.screen.width >= supportFocusSize ? passInput : null}
						/>
					</div>
					<div className="form-group">
						<button className="btn btn-block">Submit</button>
					</div>
				</form>
			</section>
		</>
	);
}
export default Login;
