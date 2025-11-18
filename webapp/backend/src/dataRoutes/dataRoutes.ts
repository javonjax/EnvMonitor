import express, { type Request, response, type Response, Router } from 'express';
import dotenv from 'dotenv';
import { DynamoDBClient, QueryCommand, type QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

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
router.get('/data/24hr/:node', async (req: Request, res: Response) => {
  try {
    const node: string = req.params.node || '1';
    const queryTime: number = Date.now() - 24 * 3600 * 1000;
    const cmd = new QueryCommand({
      TableName: process.env.AWS_DYNAMO_TABLE,
      KeyConditionExpression: '#dn = :device AND #ts >= :time',
      ExpressionAttributeNames: {
        '#dn': 'deviceName',
        '#ts': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':device': { S: `${process.env.AWS_IOT_CORE_DEVICE_NAME_BASE}${node}` },
        ':time': { N: queryTime.toString() },
      },
    });
    const responseData: QueryCommandOutput = await dynamoClient.send(cmd);
    console.log(responseData);
    const items = responseData.Items?.map((item) => unmarshall(item)) ?? [];
    res.status(200).json(items);
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
    const responseData = await dynamoClient.send(cmd);
    const items = responseData.Items?.map((item) => unmarshall(item)) ?? [];
    res.status(200).json(items[0]);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
});

export default router;
