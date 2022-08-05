import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

function Register() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
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
						<input
							type="password"
							id="password2"
							name="password2"
							value={formData.password2}
							placeholder="Confirm password"
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
export default Register;
