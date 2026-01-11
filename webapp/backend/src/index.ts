import express, { application, type Express, type Request, type Response } from 'express';
import cors from 'cors';
import mqtt from 'mqtt';
import http from 'http';
import https, { type ServerOptions } from 'https';
import { WebSocketServer, type Server } from 'ws';
import fs from 'fs';
import dotenv from 'dotenv';
import { EnvMonitorDataSchema, type EnvConfig, type EnvMonitorData } from './types.js';
import dynamoDataRoutes from './dynamoDataRoutes/dynamoDataRoutes.js';
import weatherRoutes from './weatherRoutes/weatherRoutes.js';
import type Stream from 'stream';
import { loadConfig } from './config.js';

const NODE_ENV: string = process.env.NODE_ENV as string;
dotenv.config();

const main = async () => {
  try {
    const app: Express = express();
    const port: number = 3000;

    const config: EnvConfig = await loadConfig();
    if (!config) {
      throw new Error('Failed to load config.');
    }

    // Middleware
    app.use(express.json());
    app.use(
      cors({
        origin: ['http://localhost:5173', 'https://iot-env-monitor-esp-32.vercel.app/'],
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
      })
    );
    app.use(dynamoDataRoutes(config));
    app.use(weatherRoutes(config));

    // MQTT
    const mqttClient: mqtt.MqttClient = mqtt.connect({
      host: config.mqtt.host,
      port: 8883,
      protocol: 'mqtts',
      key: config.mqtt.key,
      cert: config.mqtt.cert,
      ca: config.mqtt.ca,
      clientId: config.mqtt.clientId,
    });

    mqttClient.on('connect', () => {
      mqttClient.subscribe(config.mqtt.topic, (err: Error | null) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Subscribed to topic.');
        }
      });
      console.log('MQTT connected.');
    });

    mqttClient.on('message', (topic: string, message: Buffer<ArrayBufferLike>) => {
      if (topic === (config.mqtt.topic as string)) {
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

    // Websocket
    const wss: Server = new WebSocketServer({ noServer: true });
    wss.on('connection', () => console.log('Client connected to websocket.'));

    // Start Server
    let server:
      | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
      | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

    if (NODE_ENV === 'development') {
      server = http.createServer(app);
      server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
    } else {
      const httpsOptions: https.ServerOptions<
        typeof http.IncomingMessage,
        typeof http.ServerResponse
      > = {
        key: fs.readFileSync('/etc/letsencrypt/live/envmonitorbackend.duckdns.org/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/envmonitorbackend.duckdns.org/fullchain.pem'),
      };
      server = https.createServer(httpsOptions, app);
      server.listen(443, () => {
        console.log('Server running on port 443.');
      });
    }

    // Handle WebSocket upgrade
    server.on('upgrade', (request: http.IncomingMessage, socket: Stream.Duplex, head: Buffer) => {
      if (request.url === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  } catch (error) {
    console.error('Failed to start backend server: ', error);
    process.exit(1);
  }
};

main();
