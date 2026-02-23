import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type StatusCheck = 'work' | 'inStation' | 'onCharge' | 'offline';

export type DroneType = {
	id: number,
	title: string,
	status: StatusCheck,
	lng: number,
	lat: number,
	charge: number,
}

type Param = {
	droneList: DroneType[],
	selectedDrone: number,
}

const InitialState: Param = {
	droneList: [
		{
			id: 0,
			title: 'Drone_1',
			status: 'inStation',
			lng: 55.820848,
			lat: 49.135380,
			charge: 100,
		}
	],
	selectedDrone: 0,
}

export const DroneSlice = createSlice({
	name: 'drone',
	initialState: InitialState,
	reducers: {
		editDronePosition: (state, action: PayloadAction<{id: number, lng: number, lat: number}>) => {
			const { id, lng, lat } = action.payload;
			const drone = state.droneList.find(drone => drone.id === id);

			if (drone) {
				drone.lng = lng;
				drone.lat = lat;
			}
		},
		addDrone: (state, action: PayloadAction<DroneType>) => {
			state.droneList.push(action.payload);
		},

		removeDrone: (state, action: PayloadAction<number>) => {
			state.droneList = state.droneList.filter(drone => drone.id !== action.payload);
		},

		updateDroneStatus: (state, action: PayloadAction<{id: number, status: StatusCheck}>) => {
			const drone = state.droneList.find(drone => drone.id === action.payload.id);
			if (drone) {
				drone.status = action.payload.status;
			}
		},

		updateDroneCharge: (state, action: PayloadAction<{id: number, charge: number}>) => {
			const drone = state.droneList.find(drone => drone.id === action.payload.id);
			if (drone) {
				drone.charge = action.payload.charge;
			}
		},
	}
})

export const {
	editDronePosition,
	addDrone,
	removeDrone,
	updateDroneStatus,
	updateDroneCharge
} = DroneSlice.actions;

export default DroneSlice.reducer;