import { Worker, Job } from 'bullmq';
import { REDIS_CONNECTION, QUEUE_NAME } from './config';

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface JobResult {
  processed: boolean;
  jobId: string;
}

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job): Promise<JobResult> => {
    console.log(`Processing job ${job.id}`);
    console.log('Job data:', job.data);
    
    await sleep(7000);
    
    console.log(`Job ${job.id} completed`);
    return { processed: true, jobId: job.id || '' };
  },
  {
    connection: REDIS_CONNECTION,
    concurrency: 4,
  }
);

worker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed successfully`);
});

worker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`Job ${job?.id} has failed with error ${err.message}`);
});

console.log('Worker is running...'); 