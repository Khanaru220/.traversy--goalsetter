import { useState, useEffect, useRef } from 'react';
// useSelector: access state in Store
// useDispatch: use dispatch directly actions from slice
// (without need using connect() to Store - from 'react-redux)
import { useSelector, useDispatch } from 'react-redux';
// bring 'reducers' from slice to dispatch here (in component)
import { reset, register } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
// create notification box (often in useEffect) - base on status of slice
// (isError, isLoading, isSuccess)
import { toast } from 'react-toastify';
import { updateToast } from '../features/misc/updateToast';
import { FaUser } from 'react-icons/fa';
import Spinner from '../components/Spinner';

const delayTime = process.env.REACT_APP_DELAY_LOADING;
const supportFocusSize = process.env.REACT_APP_SUPPORT_FOCUS_SCREEN_SIZE;

function Register() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});
	const [UILoading, setUILoading] = useState(false);
	const nameInput = useRef();
	// this destructing, help we decide smaller version
	// to attach to request's body

	const navigate = useNavigate();
	const dispatch = useDispatch();
	// destruct variables from useSelector -- easier to access
	// (be updated when re-render, we only need read-only so doesn't need 'state')
	const { userToken, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.auth

		// (?) might be it decide which state to access base on
		// 'slice name' or 'string-prefix of action.type'
	);
	const { name, email, password } = formData;

	useEffect(() => {
		// focus 1st field when direct to
		nameInput?.current?.focus();
	}, []);

	useEffect(() => {
		if (!(isSuccess || isError || userToken)) return; // guard-clause

		setTimeout(() => {
			if (isError) {
				updateToast({
					toastId: 'error_register',
					type: 'error',
					message,
				});
			}

			if (userToken) {
				if (isSuccess) {
					// remove all Error noti when success
					toast.dismiss('error_register');

					// pass toastId to prevent duplicate in ReactStrictmode (dev env)
					// -when redirect by checking 'user'
					toast.success(message, { toastId: 'success_register' });
				}
				navigate('/');
			}

			// keep track base on isSuccess,isError, user
			// those think return only when reducer (register) finish
			(isSuccess || isError) && dispatch(reset());
		}, delayTime - 100);

		//not sure why track (dispatch,navigate)
	}, [userToken, isSuccess, isError, message, dispatch, navigate]);

	useEffect(() => {
		// (idea) isLoading is real data of loading status, up-to-date
		// -base on that we create UILoading (+add delay) to create Loading effect for user
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

		// 1. Validate (client): matching 2 password
		if (formData.password !== formData.password2) {
			updateToast({
				toastId: 'error_register',
				type: 'error',
				message: `Password doesn't match`,
			});

			return;
		}
		// 2. trigger register() by using dispatch
		// then call reducer(), return new state --> re-render
		dispatch(register({ name, email, password }));
	};

	if (UILoading) {
		return <Spinner />;
	}

	return (
		<>
			<section className="heading">
				<h1>
					<FaUser />
					Register
				</h1>
				<p>Please create an account</p>
			</section>
			<section className="form">
				<form onSubmit={onSubmit}>
					<div className="form-group">
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							placeholder="Enter your name"
							onChange={onChange}
							ref={window.screen.width >= supportFocusSize ? nameInput : null}
							// (prevent focus on smal screen)
							// (!) still urgly solution, because 'ref' not only for focus purpose
							required
						/>
					</div>
					<div className="form-group">
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							placeholder="Enter your email"
							onChange={onChange}
							required
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
							required
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							id="password2"
							name="password2"
							value={formData.password2}
							placeholder="Confirm password"
							onChange={onChange}
							required
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
export default Register;
