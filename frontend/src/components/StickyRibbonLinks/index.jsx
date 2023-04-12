import styles from './styles.module.css';

export default function index() {
	return (
		<div class={`${styles.container}`}>
			<a href="#" class={`${styles.ribbon}`}>
				<i class={`${styles.icon} fa-solid fa-film`}></i>
			</a>
			<a
				target="_blank"
				href="https://github.com/Khanaru220/.traversy--goalsetter-mern"
				class={`${styles.ribbon}`}
				rel="noreferrer"
			>
				<i class={`${styles.icon} fa-brands fa-github`}></i>
			</a>
		</div>
	);
}
