export default function PowerIcon({style, procent, fill}: {style: string, procent: number, fill: string}) {
	return <svg width="26" height="12" viewBox="0 0 26 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={style}>
		<rect x="0.5" y="0.5" width={21.2945 * procent / 100} height="11" rx="2.5" fill={fill}/>
		<rect x="0.5" y="0.5" width="21.2945" height="11" rx="2.5" stroke="black"/>
		<rect x="23.3562" y="2" width="2.12329" height="7" rx="1" fill="black"/>
	</svg>
}