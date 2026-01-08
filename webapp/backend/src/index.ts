import express, { application, type Express, type Request, type Response } from 'express';
import cors from 'cors';
import mqtt from 'mqtt';
import http from 'http';
import { WebSocketServer, type Server } from 'ws';
import fs from 'fs';
import dotenv from 'dotenv';
import { EnvMonitorDataSchema, type EnvMonitorData } from './types.js';
import dynamoDataRoutes from './dynamoDataRoutes/dynamoDataRoutes.js';
import weatherRoutes from './weatherRoutes/weatherRoutes.js';
import type Stream from 'stream';

dotenv.config();

const app: Express = express();
const port: number = 3000;
const lat: string = process.env.STATION_LATITUDE as string;
const lon: string = process.env.STATION_LONGITUDE as string;
const OPEN_WEATHER_MAP_API_KEY: string = process.env.OPEN_WEATHER_MAP_API_KEY as string;

const wss: Server = new WebSocketServer({ noServer: true });
const mqttClient: mqtt.MqttClient = mqtt.connect({
  host: process.env.AWS_IOT_CORE_ENDPOINT as string,
  port: 8883,
  protocol: 'mqtts',
  key: fs.readFileSync(process.env.AWS_IOT_CORE_PRIVATE_KEY_PATH as string),
  cert: fs.readFileSync(process.env.AWS_IOT_CORE_CERT_PATH as string),
  ca: fs.readFileSync(process.env.AWS_IOT_CORE_CA_PATH as string),
  clientId: process.env.AWS_IOT_CORE_BACKEND_CLIENT_ID as string,
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(dynamoDataRoutes);
app.use(weatherRoutes);

// MQTT handlers
mqttClient.on('connect', () => {
  mqttClient.subscribe(process.env.ENV_MONITOR_DATA_TOPIC as string, (err: Error | null) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Subscribed to topic.');
    }
  });
  console.log('MQTT connected.');
});

mqttClient.on('message', (topic: string, message: Buffer<ArrayBufferLike>) => {
  if (topic === (process.env.ENV_MONITOR_DATA_TOPIC as string)) {
    try {
      const payload: unknown = JSON.parse(message.toString());
      const parsedData = EnvMonitorDataSchema.safeParse(payload);
      if (!parsedData.success) {
        throw new Error('MQTT message does not fit the desired schema.');
      }
      console.log(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
});

// wss.on('connection', () => console.log('Client connected to websocket.'));

// Start Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Handle WebSocket upgrade
server.on(
  'upgrade',
  (request: http.IncomingMessage, socket: Stream.Duplex, head: NonSharedBuffer) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  }
);
