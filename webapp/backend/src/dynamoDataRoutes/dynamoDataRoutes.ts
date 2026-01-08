import express, { type Request, response, type Response, Router } from 'express';
import dotenv from 'dotenv';
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
  type EnvMonitorData,
  type EnvMonitorDataArray,
} from '../types.js';

dotenv.config();
const router: Router = express.Router();

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

/**
 * GET the last 24 hours of data from the specified device node.
 */
router.get('/data/recent/:node', async (req: Request, res: Response) => {
  try {
    const node: string = req.params.node || '1';
    // const queryTime: number = Date.now() - 24 * 3600 * 1000;
    const cmd = new QueryCommand({
      TableName: process.env.AWS_DYNAMO_TABLE,
      KeyConditionExpression: '#dn = :device',
      ExpressionAttributeNames: {
        '#dn': 'deviceName',
      },
      ExpressionAttributeValues: {
        ':device': { S: `${process.env.AWS_IOT_CORE_DEVICE_NAME_BASE}${node}` },
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
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
});

/**
 * GET the latest data from the specified device node.
 */
router.get('/data/latest/:node', async (req: Request, res: Response) => {
  try {
    const node: string = req.params.node || '1';
    const cmd = new QueryCommand({
      TableName: process.env.AWS_DYNAMO_TABLE,
      KeyConditionExpression: '#dn = :device',
      ExpressionAttributeNames: {
        '#dn': 'deviceName',
      },
      ExpressionAttributeValues: {
        ':device': {
          S: `${process.env.AWS_IOT_CORE_DEVICE_NAME_BASE}${node}`,
        },
      },
      ScanIndexForward: false,
      Limit: 1,
    });
    const dynamoRes = await dynamoClient.send(cmd);
    const jsonRes =
      dynamoRes.Items?.map((item: Record<string, AttributeValue>) => unmarshall(item)) ?? [];
    const parsedJson = EnvMonitorDataSchema.safeParse(jsonRes[0]);
    if (!parsedJson.success) {
      throw new Error('API response does not fit the desired schema.');
    }
    const dataAPIRes: EnvMonitorData = parsedJson.data;
    res.status(200).json(dataAPIRes);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
});

export default router;
