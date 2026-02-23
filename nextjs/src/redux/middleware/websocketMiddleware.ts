import { Middleware } from '@reduxjs/toolkit';
import {addDrone, editDronePosition, updateDroneCharge, updateDroneStatus} from "@/redux/drone";

let ws: WebSocket | null = null;
const RECONNECT_INTERVAL = 3000;

export const websocketMiddleware: Middleware = (store) => {
	return (next) => (action) => {
		if (action.type === 'drone/connectWebSocket') {
			if (!ws || ws.readyState === WebSocket.CLOSED) {
				connectWebSocket(store);
			}
		}
		return next(action);
	};
};

export default websocketMiddleware;

function connectWebSocket(store: any) {
	const wsUrl = `ws://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/unity-ws`;

	ws = new WebSocket(wsUrl);

	ws.onopen = () => {
		console.log('🟢 WebSocket Connected');
		store.dispatch({ type: 'drone/webSocketConnected' });
	};

	ws.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);

			switch (data.action) {
				case 'position_update':
					store.dispatch(editDronePosition({
						id: data.payload.id,
						lng: data.payload.lng,
						lat: data.payload.lat,
					}));
					break;

				case 'drone_added':
					store.dispatch(addDrone(data.payload));
					break;

				case 'status_update':
					store.dispatch(updateDroneStatus({
						id: data.payload.id,
						status: data.payload.status,
					}));
					break;

				case 'charge_update':
					store.dispatch(updateDroneCharge({
						id: data.payload.id,
						charge: data.payload.charge,
					}));
					break;
			}
		} catch (err) {
			console.error('WebSocket message error:', err);
		}
	};

	ws.onclose = () => {
		console.log('🔴 WebSocket Disconnected. Reconnecting...');
		store.dispatch({ type: 'drone/webSocketDisconnected' });

		// Авто-переподключение
		setTimeout(() => connectWebSocket(store), RECONNECT_INTERVAL);
	};

	ws.onerror = (error) => {
		console.error('WebSocket Error:', error);
	};
}