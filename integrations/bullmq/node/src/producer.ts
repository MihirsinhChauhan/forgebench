import { queue } from './connection';

type EmailJob = {
    to: string;
    subject: string;
    body: string;
}

async function main() {
    const payload: EmailJob = {
        to : 'user@example.com',
        subject : 'Test Email',
        body : 'This is a test email',
    };

    const job = await queue.add('send-email', payload, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    });
    console.log('Enqueued Job with ID:', job.id);
    await queue.close();

}

main().catch((err)=> {
    console.error('Producer failed:', err);
    process.exit(1);
})