import { configureStore } from '@reduxjs/toolkit'
import ModulesSlice from "@/redux/modules";
import Fonaru from "@/redux/fonaru";
import Drone from "@/redux/drone";
import websocketMiddleware from "@/redux/middleware/websocketMiddleware";

export const makeStore = () => configureStore({
	reducer: {
		modules: ModulesSlice,
		fonaru: Fonaru,
		drone: Drone,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(websocketMiddleware),
})

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];