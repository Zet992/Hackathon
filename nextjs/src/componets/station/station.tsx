'use client';

import TextBlock from "@/shared/textBlock/textBlock";
import styles from './station.module.scss';
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import React from "react";
import Drone from "@/componets/station/drone";
import {DroneType} from "@/redux/drone";

export default function Station() {
	const modules = useSelector((state: RootState) => state.modules);
	const droneList = useSelector((state: RootState) => state.drone.droneList);
	
	return (
	<React.Fragment>
		<TextBlock text={'Станция'} size={25} color={'white'}/>
		<div className={styles.Station__Modul}>
			<h3>Модули:</h3>
			<div className={styles.Station__Modul__Content}>
				<TextBlock text={`Рабочие: ${modules.workModules}/${modules.allModules}`} size={25} color={'white'}
									 style={styles.Station__Modul__Content__Text}/>
				<TextBlock text={`Требуется ремонт: ${modules.allModules - modules.workModules}`} size={25} color={'white'}
									 style={styles.Station__Modul__Content__Text}/>
			</div>
		</div>
		<div className={styles.Station__Drone}>
			<h3>Дроны:</h3>
			<div className={styles.Station__Drone}>
				{ droneList.map((drone: DroneType, index: number) => (
					<React.Fragment key={`drone-${index}`}>
						<Drone droneName={drone.title} droneStatus={drone.status} powerProcent={drone.charge}/>
					</React.Fragment>
				))}
			</div>
		</div>
	</React.Fragment>
	)
}