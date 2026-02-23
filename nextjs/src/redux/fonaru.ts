import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type StatusCheck = 'enable' | 'disable' | 'offline' | 'toReplice';
type FonaruType = {
	id: number,
	lng: number,
	lat: number,
	status: StatusCheck,
}

type Params = {
	fonaruList: FonaruType[],
	selectedId: number,
}

const InitialState: Params = {
	fonaruList: [
		{
			id: 0,
			lng: 55.821164,
			lat: 49.135005,
			status: 'toReplice'
		},
		{
			id: 1,
			lng: 55.820606,
			lat: 49.135076,
			status: 'toReplice'
		}
	],
	selectedId: 1,
}

export const fonaruSlice = createSlice({
	name: 'FonaruSlice',
	initialState: InitialState,
	reducers: {
		editStatus: (state, action: PayloadAction<{ id: number, status: StatusCheck }>) => {
			const item = state.fonaruList.find(f => f.id === action.payload.id);
			if (item) {
				item.status = action.payload.status;
			}
		},
		addFonaru: (state, action: PayloadAction<FonaruType>) => {
			state.fonaruList.push(action.payload);
		},
		removeFonaru: (state, action: PayloadAction<number>) => {
			state.fonaruList = state.fonaruList.filter(f => f.id !== action.payload);
		},
		editSelectedId: (state, action: PayloadAction<{id: number}>) => {
			state.selectedId = action.payload.id;
		}
	}
})

export const { editStatus, addFonaru, removeFonaru, editSelectedId } = fonaruSlice.actions;
export default fonaruSlice.reducer;
