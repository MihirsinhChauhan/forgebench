# Mini Notification Service

**Status:** `draft`

A small async notification system built on BullMQ — API receives events, fans out to channel-specific workers.

## What you'll practice

- Async API design (`202 Accepted`, enqueue-only)
- Queue fan-out pattern (ingress → router → per-channel queues)
- Channel isolation and independent retries
- Idempotency via `Idempotency-Key`
- Provider abstraction (mock email, push, SMS)

## Prerequisites

Complete [BullMQ Queue Fundamentals](../../integrations/bullmq/queue-fundamentals/) first.

## Planned structure

```
notification-system/
├── DESIGN.md
├── README.md
├── docker-compose.yml
├── .env.example
└── node/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── api/
        │   ├── server.ts
        │   └── routes/
        │       └── notifications.ts
        ├── queues/
        │   ├── connection.ts
        │   ├── names.ts
        │   └── index.ts
        ├── workers/
        │   ├── router.worker.ts
        │   ├── email.worker.ts
        │   ├── push.worker.ts
        │   └── sms.worker.ts
        ├── providers/
        │   ├── email.provider.ts
        │   ├── push.provider.ts
        │   └── sms.provider.ts
        └── types/
            └── notification.ts
```

## Implementation phases

| Phase | Scope |
|-------|-------|
| 1 | API + `notifications` queue + router worker |
| 2 | Email channel (queue + worker + mock provider) |
| 3 | Push + SMS channels |
| 4 | Idempotency via `Idempotency-Key` |
| 5 | Graceful shutdown on all workers |

## How to run

> Not implemented yet. Read [DESIGN.md](./DESIGN.md) and implement phase by phase.

```bash
# Planned commands
docker compose up -d
cd node && npm install
npm run api           # terminal 1
npm run worker:router # terminal 2
npm run worker:email  # terminal 3
# ... push, sms workers in additional terminals
```

## Learnings

_Document what you learned after each session._
