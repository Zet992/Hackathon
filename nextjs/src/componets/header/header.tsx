import styles from './header.module.scss';
import UiForm from "../../shared/uiForm/uiForm";

export default function Header() {
	return <header className={styles.Header}>
		<UiForm style={styles.Header__Form}>
			<h1 className={styles.Header__Text}>За горизонтом</h1>
		</UiForm>
	</header>
}