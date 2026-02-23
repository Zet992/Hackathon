import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { parse } from 'url';
import type { UrlWithParsedQuery } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import type {RawData} from 'ws';

const dev = process.env.NODE_ENV !== 'production';
type NextServer = ReturnType<typeof next>;
const app: NextServer = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// Типы для сообщений
interface Message {
	action: string;
	payload?: unknown;
	timestamp?: number;
	status?: string;
	time?: number;
}

interface MovePayload {
	x?: number;
	y?: number;
	z?: number;
	[key: string]: unknown;
}

interface BroadcastData {
	action: string;
	payload?: unknown;
	timestamp: number;
}

app.prepare().then(() => {
	const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
		const parsedUrl: UrlWithParsedQuery = parse(req.url || '', true);
		handle(req, res, parsedUrl);
	});

	const wss: WebSocketServer = new WebSocketServer({ noServer: true });
	function broadcast(data: BroadcastData): void {
		const message: string = JSON.stringify(data);
		wss.clients.forEach((client: WebSocket) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	}

	// Перехватываем апгрейд соединения
	server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
		const { pathname } = parse(request.url || '', true);

		// Проверяем путь: Unity будет стучаться на /unity-ws
		if (pathname === '/unity-ws') {
			wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
				wss.emit('connection', ws, request);
			});
		} else {
			socket.destroy();
		}
	});

	server.listen(PORT, (err?: Error) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${PORT}`);
		console.log(`> WebSocket ready on ws://localhost:${PORT}/unity-ws`);
	});

	wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
		console.log('🟢 Unity Client Connected');

		wss.on('message', ( rawData: RawData) => {
			try {
				const data = rawData.toString().split('%');
				const lng = data[1];
				const lat = data[3];

				broadcast({
					action: 'position_update',
					payload: {
						id: 0,
						lng: lng,
						lat: lat,
						charge: 100,
						status: 'work',
					},
					timestamp: Date.now(),
				});
			} catch (err) {
				console.error('Error:', err);
			}
		});
	});
})