import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

import { toast } from 'react-toastify';

function Header() {
	const { userToken } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	return (
		<header className="header">
			<Link to="/">GoalSetter</Link>

			<ul>
				{/* need more beautiful way to write condition
				inside 'return' */}
				{userToken ? (
					// I define "logging" mean user's token exist in state
					// (?) maybe, to define is that token expired.
					// -need to handle on different logic
					<li>
						<Link
							to="/login"
							className="btn"
							onClick={() => {
								dispatch(logout());
								toast.dismiss();
							}}
						>
							<FaSignOutAlt />
							Logout
						</Link>
					</li>
				) : (
					<>
						<li>
							<Link to="/login">
								<FaSignInAlt />
								Login
							</Link>
						</li>
						<li>
							<Link to="/register">
								<FaUser />
								Register
							</Link>
						</li>
					</>
				)}
			</ul>
		</header>
	);
}
export default Header;
