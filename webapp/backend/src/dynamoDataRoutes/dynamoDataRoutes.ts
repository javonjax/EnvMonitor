import express, { type Request, response, type Response, Router } from 'express';
import {
  DynamoDBClient,
  QueryCommand,
  type AttributeValue,
  type QueryCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import {
  EnvMonitorDataArraySchema,
  EnvMonitorDataSchema,
  type EnvConfig,
  type EnvMonitorData,
  type EnvMonitorDataArray,
} from '../types.js';

const NODE_ENV: string = process.env.NODE_ENV as string;
const AWS_REGION: string = process.env.AWS_REGION as string;

export const dynamoDataRoutes = (config: EnvConfig): Router => {
  const router: Router = express.Router();
  let dynamoClient: DynamoDBClient;
  if (NODE_ENV === 'production') {
    dynamoClient = new DynamoDBClient({
      region: AWS_REGION,
    });
  } else {
    dynamoClient = new DynamoDBClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  /**
   * GET the 50 most recent data rows for the specified device node.
   */
  router.get('/data/recent/:node', async (req: Request, res: Response) => {
    const node: string = req.params.node || '1';
    // const queryTime: number = Date.now() - 24 * 3600 * 1000;
    const cmd = new QueryCommand({
      TableName: config.dynamo.table,
      KeyConditionExpression: '#dn = :device',
      ExpressionAttributeNames: {
        '#dn': 'deviceName',
      },
      ExpressionAttributeValues: {
        ':device': { S: `${config.mqtt.deviceNameBase}${node}` },
      },
      ScanIndexForward: false,
      Limit: 50,
      ConsistentRead: true,
    });

    const dynamoRes: QueryCommandOutput = await dynamoClient.send(cmd);
    const jsonArrayRes: unknown =
      dynamoRes.Items?.reverse().map((item: Record<string, AttributeValue>) => unmarshall(item)) ??
      [];
    const parsedJson = EnvMonitorDataArraySchema.safeParse(jsonArrayRes);
    if (!parsedJson.success) {
      throw new Error('API response does not fit the desired schema.');
    }
    const dataAPIRes: EnvMonitorDataArray = parsedJson.data;
    res.status(200).json(dataAPIRes);
    return;
  });

  /**
   * GET the latest single data row for the specified device node.
   */
  router.get('/data/latest/:node', async (req: Request, res: Response) => {
    const node: string = req.params.node || '1';
    const cmd = new QueryCommand({
      TableName: config.dynamo.table,
      KeyConditionExpression: '#dn = :device',
      ExpressionAttributeNames: {
        '#dn': 'deviceName',
      },
      ExpressionAttributeValues: {
        ':device': {
          S: `${config.mqtt.deviceNameBase}${node}`,
        },
      },
      ScanIndexForward: false,
      Limit: 1,
    });
    const dynamoRes: QueryCommandOutput = await dynamoClient.send(cmd);
    const jsonRes =
      dynamoRes.Items?.map((item: Record<string, AttributeValue>) => unmarshall(item)) ?? [];
    const parsedJson = EnvMonitorDataSchema.safeParse(jsonRes[0]);
    if (!parsedJson.success) {
      throw new Error('API response does not fit the desired schema.');
    }
    const dataAPIRes: EnvMonitorData = parsedJson.data;
    res.status(200).json(dataAPIRes);
    return;
  });

  return router;
};

export default dynamoDataRoutes;
