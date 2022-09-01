import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';

import { useSelector } from 'react-redux';
function App() {
	const { userToken } = useSelector((state) => state.auth);
	// (Toastify's hook) 'notifcation' give us info about notication center
	// -(id, name,status,...)
	// (need to call in <App/>) idk why it only display notification of current component call it

	return (
		<Router>
			<div className="container">
				<Header />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route
						path="/"
						element={
							userToken ? <Dashboard /> : <Navigate to="/login" replace />
						}
					/>
				</Routes>

				<ToastContainer
					position="top-right"
					pauseOnFocusLoss={false}
					transition={Zoom}
					closeOnClick={true}
				/>
			</div>
		</Router>
	);
}

export default App;
