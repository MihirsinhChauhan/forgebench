# Mini Notification Service

## Functional requirements

- [ ] Accept notification requests via HTTP (`POST /notifications`)
- [ ] Return `202 Accepted` immediately — do not block on delivery
- [ ] Fan out to independent channels: email, push, SMS
- [ ] Each channel worker retries on failure (3 attempts, exponential backoff)
- [ ] Mock providers — log delivery to console, no real SendGrid/FCM/Twilio
- [ ] Support `Idempotency-Key` header to prevent duplicate enqueues

## Non-functional requirements

| Concern | Target |
|---------|--------|
| API latency | < 50ms (enqueue only, no provider calls) |
| Channel isolation | Email failure does not block push or SMS |
| Idempotency | Same key → same `notificationId`, no re-enqueue |
| Observability | Log `notificationId` + `jobId` through entire pipeline |
| Local dev | Redis via docker-compose, all processes runnable locally |

## API / interface sketch

### `POST /notifications`

```http
POST /notifications
Content-Type: application/json
Idempotency-Key: order-123-shipped

{
  "userId": "user_abc",
  "event": "order.shipped",
  "channels": ["email", "push"],
  "payload": {
    "orderId": "ord_123",
    "trackingUrl": "https://track.example.com/ord_123"
  }
}
```

**Response `202 Accepted`:**

```json
{
  "notificationId": "notif_xyz",
  "status": "queued"
}
```

### Internal job types

```typescript
// Ingress — enqueued by API
type NotificationJob = {
  notificationId: string;
  userId: string;
  event: string;
  channels: ('email' | 'push' | 'sms')[];
  payload: Record<string, unknown>;
};

// Per-channel — enqueued by router worker
type ChannelDeliveryJob = {
  notificationId: string;
  userId: string;
  channel: 'email' | 'push' | 'sms';
  template: string;
  payload: Record<string, unknown>;
};
```

### Provider interface

```typescript
interface NotificationProvider {
  send(job: ChannelDeliveryJob): Promise<void>;
}
```

## Data model

### v1 (this lab) — Redis only

- BullMQ job state is the source of truth
- No persistent notification history

### v2 (production stretch)

```sql
notifications (id, user_id, event, status, created_at)
notification_deliveries (id, notification_id, channel, status, attempts, last_error)
user_preferences (user_id, channel, enabled)
```

## Architecture

```
Client
  │
  ▼
Notification API ──enqueue──▶ notifications queue
                                    │
                                    ▼
                              Router Worker
                               ╱    │    ╲
                              ▼     ▼     ▼
                         email   push    sms
                         queue   queue   queue
                          │       │       │
                          ▼       ▼       ▼
                       Email   Push     SMS
                       Worker  Worker  Worker
                          │       │       │
                          ▼       ▼       ▼
                       Mock providers (console log)
```

## Approach

### Chosen: ingress queue → router → per-channel queues

- API enqueues one `NotificationJob` to `notifications` queue
- Router worker fans out to `email`, `push`, `sms` queues
- Each channel has its own worker and mock provider
- Channels scale and fail independently

### Alternatives considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Single queue, named processors | Simpler, fewer moving parts | No per-channel scaling or isolation | Good for v0, outgrown quickly |
| Per-channel queues (chosen) | Independent retries, scaling, rate limits | More processes to run | **Chosen** |
| Direct API → provider calls | Simplest code | Blocks API, no retries, tight coupling | Anti-pattern for notifications |
| Event bus (Kafka/SNS) | High throughput, replay | Overkill for this lab | Compare later |

## Queue names

| Queue | Producer | Consumer |
|-------|----------|----------|
| `notifications` | API | Router worker |
| `email` | Router worker | Email worker |
| `push` | Router worker | Push worker |
| `sms` | Router worker | SMS worker |

## Edge cases

| Case | Behavior |
|------|----------|
| Unknown channel in request | `400 Bad Request` at API |
| Empty `channels` array | `400 Bad Request` |
| Duplicate `Idempotency-Key` | Return existing `notificationId`, status `queued` |
| Provider throws | Retry 3x with backoff, then `failed` |
| Router fails mid-fan-out | Partial channel jobs may exist; acceptable for v1 |
| User has no contact for channel | Skip channel, log warning (v2: check user profile) |

## Implementation phases

| Phase | Scope |
|-------|-------|
| 1 | API + `notifications` queue + router worker |
| 2 | Email channel (queue + worker + mock provider) |
| 3 | Push + SMS channels |
| 4 | Idempotency via `Idempotency-Key` → BullMQ `jobId` |
| 5 | Graceful shutdown on all workers |

## What I'd do in production

- **User preferences** — opt-out per channel before fan-out
- **Template engine** — Handlebars/Mustache per `event` + `channel`
- **Audit trail** — Postgres `notifications` + `notification_deliveries` tables
- **DLQ alerting** — alert when failed job count exceeds threshold
- **Bull Board** — queue inspection UI
- **Rate limiting** — per-provider limits (SendGrid 100/s, etc.)
- **Webhook status** — `POST /notifications/:id/status` for delivery callbacks
- **Multi-tenancy** — tenant-scoped queues or job metadata

## Prerequisites

Complete [BullMQ Queue Fundamentals](../../integrations/bullmq/queue-fundamentals/) first.

## Status

`draft`
