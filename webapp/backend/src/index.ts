import express, { type Request, type Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
