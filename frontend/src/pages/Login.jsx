import { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const onChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};
	const onSubmit = (e) => {
		e.preventDefault();
	};
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
