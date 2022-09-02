import {
	useEffect,
	useState,
	useRef,
	useImperativeHandle,
	forwardRef,
} from 'react';
import { addGoal, reset } from '../features/goals/goalSlice';
import { useSelector, useDispatch } from 'react-redux';
const supportFocusSize = process.env.REACT_APP_SUPPORT_FOCUS_SCREEN_SIZE;

function GoalForm() {
	const [formData, setFormData] = useState({
		text: '',
	});
	const focusOnForm = useRef();
	const textInput = useRef();
	const dispatch = useDispatch();

	useEffect(() => {
		// (ờ ha sao mình dại khờ đến vậy) đâu phải lúc nào Dashboard cũng cần focus
		// -(cái thực sự cần focus) là khi GoalForm mount.
		// -ko có GoalForm thì focus cái gì được???

		// focus input when first-visit(mounting) + after submit(re-render)
		focusOnForm.current = textInput?.current?.focus();
		focusOnForm.current?.();
		// (?) stll don't know why it doesn't focus again if I click Submit by mouse
	}, []);

	const onChange = (e) => {
		setFormData({ [e.target.id]: e.target.value });
	};
	const onSubmit = (e) => {
		e.preventDefault();

		dispatch(addGoal(formData.text));

		// reset input field when finished
		setFormData({
			text: '',
		});

		// (??????????????????????) why now it work, can focus after click Submit by mouse
		// -(Powered by M<agic)
		textInput?.current?.focus?.();
	};

	return (
		<section className="form">
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<input
						type="text"
						id="text"
						name="text"
						value={formData.text}
						placeholder="Enter your goal"
						onChange={onChange}
						ref={window.screen.width >= supportFocusSize ? textInput : null}
						required
					/>
				</div>
				<div className="form-group">
					<button className="btn btn-block">Add Goal</button>
				</div>
			</form>
		</section>
	);
}
export default GoalForm;
export const GoalForm_forward = forwardRef(GoalForm);
