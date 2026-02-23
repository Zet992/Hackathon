import styles from './textBlock.module.scss';

export default function TextBlock({text, size, color, style}: Readonly<{
	text: string | number,
	size: 36 | 25 ,
	color: 'white' | 'black',
	style?: string;
}>) {
	return <p
	className={`${styles.TextBlock} ${style}`}
	style={{
		fontSize: size,
		color: color,
		backgroundColor: (color=='white') ? '#534E4E' : '#D9D9D9'
	}}>
		{text}
	</p>
}