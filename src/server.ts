import express, { Request, Response } from 'express';
import { Queue, Job } from 'bullmq';
import { REDIS_CONNECTION, QUEUE_NAME } from './config';

const app = express();
app.use(express.json());

interface ProcessJobData {
  [key: string]: any;
}

const processingQueue = new Queue(QUEUE_NAME, {
  connection: REDIS_CONNECTION,
});

app.post('/process', async (req: Request, res: Response) => {
  try {
    const jobData: ProcessJobData = req.body;
    const job: Job = await processingQueue.add('process-task', jobData);
    
    res.json({
      message: 'Job added to queue',
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add job to queue',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 