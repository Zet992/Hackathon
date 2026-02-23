'use client';

import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {editSelectedId} from "@/redux/fonaru";

const createIcon = (iconUrl: string, size: [number, number] = [64, 64]) => {
	return L.icon({
		iconUrl,
		iconSize: size,
		iconAnchor: [size[0] / 2, size[1] / 2],
		popupAnchor: [0, -size[1]],
	});
};

export default function Map() {
	const fonaruList = useSelector((state: RootState) => state.fonaru.fonaruList);
	const selectedDrone = useSelector((state: RootState) => state.drone.selectedDrone);
	const drone = useSelector((state: RootState) => state.drone.droneList[selectedDrone]);
	const droneIcon = createIcon('/Drone.svg');
	const fonaruIconError = createIcon('/LocationError.svg');
	const fonaruIconNotError = createIcon('/LocationNotError.svg');
	const homeIcon = createIcon('/Home.svg');
	const dispatch = useDispatch();
	const markersData = [
		{ position: [drone.lng, drone.lat] as [number, number], icon: droneIcon},
	];

	return (
	<MapContainer
		center={[55.820848, 49.135380]}
		zoom={18}
		style={{height: '100%', width: '100%'}}
		scrollWheelZoom={false}
	>
		<TileLayer
			attribution='&copy; OpenStreetMap contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		{ (drone.lng != 55.820848 && drone.lat != 49.135380) ?
			<Marker
				key={'home-icon'}
				position={[55.820848, 49.135380]}
				icon={homeIcon}
				>
			</Marker>
		: <></>},
		{markersData.map((marker, index) => (
			<Marker
				key={index}
				position={marker.position}
				icon={marker.icon}
				>
			</Marker>
		))}
		{fonaruList.map((fonaruMarker, index) => (
			<Marker
				key={index+2}
				position={[fonaruMarker.lng, fonaruMarker.lat]}
				icon={fonaruMarker.status == 'disable' || fonaruMarker.status == 'toReplice' ? fonaruIconError : fonaruIconNotError}
				eventHandlers={{
					click: () => {
						dispatch(editSelectedId({
							id: fonaruMarker.id,
						}));
					},
				}}
			>
			</Marker>
		))}
	</MapContainer>
	);
}