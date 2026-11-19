# BullMQ Queue Fundamentals

## Functional requirements

- [ ] Add jobs from a standalone producer process
- [ ] Process jobs in a separate worker process
- [ ] Support multiple job types on a single queue (named processors)
- [ ] Retry failed jobs with exponential backoff (3 attempts)
- [ ] Log job lifecycle: `waiting` → `active` → `completed` / `failed`
- [ ] Inspect and manually retry failed jobs

## Non-functional requirements

| Concern | Target |
|---------|--------|
| Process separation | Producer and worker run as independent processes |
| Local dev | Redis via docker-compose |
| Idempotency | Support `jobId` to prevent duplicate processing |
| Failure handling | Worker crash mid-job → BullMQ stalled-job recovery |

## API / interface sketch

```typescript
// Job payload
type EmailJob = {
  to: string;
  subject: string;
  body: string;
};

// Producer
queue.add('send-email', payload, {
  jobId?: string;           // idempotency
  attempts: 3;
  backoff: { type: 'exponential', delay: 1000 };
});

// Worker
worker.process('send-email', async (job) => { ... });
```

## Data model

- **Redis** — BullMQ stores job state, no separate DB for this lab
- **Queue name:** `email-jobs` (single queue, multiple named job types)
- **Job states:** `waiting`, `active`, `completed`, `failed`, `delayed`

## Approach

### Chosen: BullMQ on Redis

BullMQ provides retries, backoff, job state, and stalled-job recovery out of the box.

### Alternatives considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Raw Redis lists (LPUSH/BRPOP) | Full control, no dependency | Manual DLQ, retries, state tracking | Too much boilerplate for a lab |
| RabbitMQ | Strong routing, AMQP | Separate infra from Redis stack | Good compare lab later |
| BullMQ | Node-native, Redis-backed, rich job options | Redis single point of failure | **Chosen** |

## Concepts to implement (in order)

1. Basic queue — `Queue` + `Worker`, process a simple job
2. Job options — `attempts`, `backoff`, `delay`
3. Job states — observe transitions in logs
4. Failed jobs — inspect `failed` set, manual retry
5. Named processors — different job types on one queue
6. Idempotency — same `jobId` does not create duplicate jobs

## Edge cases

| Case | Behavior |
|------|----------|
| Worker crashes mid-job | Job returns to queue after stall timeout |
| Duplicate `jobId` | BullMQ rejects or returns existing job |
| Redis unavailable | Producer fails fast with clear error |
| Job throws on every attempt | Lands in `failed` after max retries |
| Delayed job | Sits in `delayed` until window expires |

## What I'd do in production

- **Bull Board** — web UI for queue inspection
- **Graceful shutdown** — `worker.close()` on SIGTERM, drain in-flight jobs
- **Metrics** — job duration, failure rate, queue depth (Prometheus)
- **Multiple workers** — horizontal scaling behind same queue name
- **Connection pooling** — shared `IORedis` connection config
- **Structured logging** — correlation via `job.id` in every log line

## Status

`draft`
