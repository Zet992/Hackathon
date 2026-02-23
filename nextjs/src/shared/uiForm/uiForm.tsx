import styles from './uiForm.module.scss';
import React from "react";

export default function UiForm({children, style}: Readonly<{ children: React.ReactNode, style?: string;}>) {
	return <div className={`${styles.UiForm} ${style}`}>
		{children}
	</div>
}