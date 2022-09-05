import { deleteGoal } from '../features/goals/goalSlice';
import { useDispatch } from 'react-redux';
import { FaDivide } from 'react-icons/fa';

function GoalItem({ goal, numOrder }) {
	const dispatch = useDispatch();
	const formatLineBrString = goal.text.replaceAll(/\\n/g, '<br>\n');

	return (
		<div className="goal">
			<div className="number">
				{new Date(goal.createdAt).toLocaleString('en-UK')}
			</div>
			<div className="number" style={{ fontStyle: 'italic', fontSize: '50%' }}>
				-{numOrder}-
			</div>
			{/* wala, 1h to find how to convert string_HTML to HTML markup */}
			<h2 dangerouslySetInnerHTML={{ __html: formatLineBrString }} />
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
