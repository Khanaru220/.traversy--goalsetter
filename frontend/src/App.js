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
					{/* should choose 1 way to navigate (<Navugate> here OR useNavigate() hook) */}
					{/* careful 2 cases need navigate: (1) isSuccess after login,register */}
					{/* (2) useToken already exist, user go directly URl, we bring them back */}
					{/* (bug) miss 2 way of navigate. When login/register finish*/}
					{/* -the page re-render. userToken (mouting) exist before isSuccess (useEffect)*/}
					{/* -so the logic of isSuccess not be executed. Because the page navigate right away in Mounting App.js */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/"
						element={
							userToken ? <Dashboard /> : <Navigate to="/login" replace />
						}
					/>{' '}
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
