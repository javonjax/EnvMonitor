import fs from 'fs';
import dotenv from 'dotenv';
import {
  SSMClient,
  GetParametersCommand,
  type GetParametersCommandOutput,
  type Parameter,
} from '@aws-sdk/client-ssm';
import type { EnvConfig, EnvParams } from './types.js';
dotenv.config();

const NODE_ENV: string = process.env.NODE_ENV as string;
const AWS_REGION: string = process.env.AWS_REGION as string;

const ssm: SSMClient | null =
  NODE_ENV === 'production' ? new SSMClient({ region: AWS_REGION }) : null;

const paramNames: (keyof EnvParams)[] = [
  '/certs/AmazonRootCA1.pem',
  '/certs/certificate.pem.crt',
  '/certs/private.pem.key',
  '/env/AWS_DYNAMO_TABLE',
  '/env/AWS_IOT_CORE_BACKEND_CLIENT_ID',
  '/env/AWS_IOT_CORE_DEVICE_NAME_BASE',
  '/env/AWS_IOT_CORE_ENDPOINT',
  '/env/ENV_MONITOR_DATA_TOPIC',
  '/env/OPEN_WEATHER_MAP_API_KEY',
  '/env/OPEN_WEATHER_MAP_ONECALL_URL',
  '/env/STATION_LATITUDE',
  '/env/STATION_LONGITUDE',
];

const getParams = async (names: (keyof EnvParams)[]): Promise<EnvParams> => {
  if (!ssm) {
    throw new Error('SSM client is not available.');
  }

  const cmd: GetParametersCommand = new GetParametersCommand({
    Names: names,
    WithDecryption: true,
  });
  const res: GetParametersCommandOutput = await ssm.send(cmd);

  if (!res.Parameters) {
    throw new Error(`Unable to fetch parameters.`);
  }

  const params: EnvParams = {} as EnvParams;
  for (const p of res.Parameters) {
    if (p.Name && p.Value) {
      params[p.Name as keyof EnvParams] = p.Value;
    }
  }

  for (const name of paramNames) {
    if (!params[name]) {
      throw new Error(`Missing parameter: ${name}`);
    }
  }

  return params;
};

export const generateConfig = async (): Promise<EnvConfig> => {
  let config: EnvConfig;
  if (NODE_ENV === 'production') {
    const params: EnvParams = await getParams(paramNames);
    if (!params) {
      throw new Error('No parameters found.');
    }
    config = {
      mqtt: {
        host: params['/env/AWS_IOT_CORE_ENDPOINT'],
        deviceNameBase: params['/env/AWS_IOT_CORE_DEVICE_NAME_BASE'],
        clientId: params['/env/AWS_IOT_CORE_BACKEND_CLIENT_ID'],
        topic: params['/env/ENV_MONITOR_DATA_TOPIC'],
        key: Buffer.from(params['/certs/private.pem.key'], 'utf-8'),
        cert: Buffer.from(params['/certs/certificate.pem.crt'], 'utf-8'),
        ca: Buffer.from(params['/certs/AmazonRootCA1.pem'], 'utf-8'),
      },
      dynamo: {
        table: params['/env/AWS_DYNAMO_TABLE'],
      },
      weather: {
        apiUrl: params['/env/OPEN_WEATHER_MAP_ONECALL_URL'],
        apiKey: params['/env/OPEN_WEATHER_MAP_API_KEY'],
        latitude: params['/env/STATION_LATITUDE'],
        longitude: params['/env/STATION_LONGITUDE'],
      },
    };
  } else {
    config = {
      mqtt: {
        host: process.env.AWS_IOT_CORE_ENDPOINT as string,
        deviceNameBase: process.env.AWS_IOT_CORE_DEVICE_NAME_BASE as string,
        clientId: process.env.AWS_IOT_CORE_BACKEND_CLIENT_ID as string,
        topic: process.env.ENV_MONITOR_DATA_TOPIC as string,
        key: fs.readFileSync(process.env.AWS_IOT_CORE_PRIVATE_KEY_PATH as string),
        cert: fs.readFileSync(process.env.AWS_IOT_CORE_CERT_PATH as string),
        ca: fs.readFileSync(process.env.AWS_IOT_CORE_CA_PATH as string),
      },
      dynamo: {
        table: process.env.AWS_DYNAMO_TABLE as string,
      },
      weather: {
        apiUrl: process.env.OPEN_WEATHER_MAP_ONECALL_URL as string,
        apiKey: process.env.OPEN_WEATHER_MAP_API_KEY as string,
        latitude: process.env.STATION_LATITUDE as string,
        longitude: process.env.STATION_LONGITUDE as string,
      },
    };
  }
  return config;
};
