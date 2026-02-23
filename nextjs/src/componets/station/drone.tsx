'use client';

import styles from './drone.module.scss';
import Icons from "@/shared/icons/icon";

type StatusCheck = 'work' | 'inStation' | 'onCharge' | 'offline';

type StatusConfig = {
	title: string,
	style: string,
}

const StatusRecord: Record<StatusCheck, StatusConfig> = {
	'work': {
		title: 'На работе',
		style: styles.Drone__Content__Status_work
	},
	'inStation': {
		title: 'На станции',
		style: styles.Drone__Content__Status_inStation,
	},
	'onCharge': {
		title: 'На зарядке',
		style: styles.Drone__Content__Status_onCharge,
	},
	'offline': {
		title: 'Не в сети',
		style: styles.Drone__Content__Status_offline,
	}
}

export default function Drone({droneName, droneStatus, powerProcent}: {droneName: string, droneStatus: StatusCheck, powerProcent?: number}) {
	const status = StatusRecord[droneStatus];

	return <div className={styles.Drone}>
		<Icons.DroneIcon className={styles.Drone__Icon}/>
		<div className={styles.Drone__Content}>
			<h5>{droneName}</h5>
			<p className={`${styles.Drone__Content__Status} ${status.style}`}>{status.title}</p>
		</div>
		{ (powerProcent != undefined) ? <div className={styles.Drone__Content__Power}>
			<Icons.PowerIcon style={`${styles.Drone__Content__Power__Icon}`} procent={powerProcent} fill={ (powerProcent > 75) ? '#1BBE0C' : (powerProcent > 50) ? 'darkorange' : '#D20202'}/>
			<p className={styles.Drone__Content__Power__Text}>{powerProcent}%</p>
		</div> : <></> }
	</div>
}