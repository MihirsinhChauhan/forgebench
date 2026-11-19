import  {Worker} from 'bullmq';
import './connection';

const worker = new Worker(
    'queue-fundamentals',
    async (job) => {
        if (job.name === 'send-email') {
            const { to, subject, body } = job.data;
            console.log(`Sending email to ${to} : ${subject}`);

            // simulate worker
            await new Promise((r) => setTimeout(r, 500));
            console.log(body);
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: Number(process.env.REDIS_PORT ?? 6379),
        },
    },
);

worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, error) => console.log(`Job ${job?.id} failed: ${error.message}`));

