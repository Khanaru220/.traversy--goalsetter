import { deleteGoal } from '../features/goals/goalSlice';
import { useDispatch } from 'react-redux';
import { FaDivide } from 'react-icons/fa';

function GoalItem({ goal, index }) {
	const dispatch = useDispatch();

	return (
		<div className="goal">
			<div>{new Date(goal.createdAt).toLocaleString('en-UK')} </div>
			<div style={{ fontStyle: 'italic', fontSize: '50%' }}>-{index}-</div>
			<h2>{goal.text}</h2>
			<button
				onClick={(e) => {
					dispatch(deleteGoal(goal._id));
					e.target.closest('.goal').classList.add('removed-goal');
				}}
				onMouseEnter={(e) => {
					e.target.closest('.goal').classList.add('close-hover');
				}}
				onMouseLeave={(e) => {
					e.target.closest('.goal').classList.remove('close-hover');
				}}
				className="close"
			>
				X
			</button>
		</div>
	);
}
export default GoalItem;
