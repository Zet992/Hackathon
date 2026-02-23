import {createSlice} from "@reduxjs/toolkit";

type sliceParam = {
	allModules: number,
	workModules: number,
}

const initialState: sliceParam = {
	allModules: 20,
	workModules: 10,
}

export const ModulesSlice = createSlice({
	name: 'ModulesSlice',
	initialState: initialState,
	reducers: {
		editState: (state, action: { payload: sliceParam }) => {
			state.allModules = action.payload.allModules;
			state.workModules = action.payload.workModules;
		}
	}
})

export const { editState } = ModulesSlice.actions;
export default ModulesSlice.reducer;
