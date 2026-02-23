'use client';

import styles from './fonaru.module.scss';
import TextBlock from "@/shared/textBlock/textBlock";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

type StatusCheck = 'enable' | 'disable' | 'offline' | 'toReplice';
type StatusConfig = {
	title: string,
	color: string,
}

const StatusRecord: Record<StatusCheck, StatusConfig> = {
	'enable': {
		title: 'Исправен | Вкл.',
		color: '#1CBC5E',
	},
	'disable': {
		title: 'Исправен | Выкл.',
		color: 'black',
	},
	'offline': {
		title: 'Вне сети',
		color: '#D20202',
	},
	'toReplice': {
		title: 'Требует замену',
		color: 'darkorange',
	}
}

export default function Fonaru() {
	const temperatura = -10;
	const selectedFonaru = useSelector((state: RootState) => state.fonaru.selectedId);
	const fonaru = useSelector((state: RootState) => state.fonaru.fonaruList[selectedFonaru]);
	const status: StatusConfig = StatusRecord[fonaru.status];

	return <React.Fragment>
		<TextBlock text={'Фонарь'} size={25} color={'white'}/>
		<TextBlock text={'Статус лампы'} size={25} color={'white'}/>
		<div className={styles.Fonaru__Status}>
			<span className={styles.Fonaru__Status_ball} style={{backgroundColor: status.color}}></span>
			<p>{status.title}</p>
		</div>
		<TextBlock text={`Координаты: ${fonaru.lng}, ${fonaru.lat}`} size={25} color={'white'}/>
		<TextBlock text={`Температура: ${temperatura}°C`} size={25} color={'white'}/>
	</React.Fragment>
}