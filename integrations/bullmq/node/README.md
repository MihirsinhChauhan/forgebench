# BullMQ Queue Fundamentals

**Status:** `draft`

Learn BullMQ primitives in isolation before building the notification service.

## What you'll practice

- Queue + Worker process separation
- Job retries and exponential backoff
- Named job processors
- Job lifecycle and failure handling
- Idempotency via `jobId`

## Prerequisites

- Node.js 20+
- Docker (for Redis)

## Planned structure

```
queue-fundamentals/
├── DESIGN.md
├── README.md
├── docker-compose.yml
├── .env.example
└── node/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── connection.ts
        ├── producer.ts
        ├── worker.ts
        └── jobs/
            └── email.job.ts
```

## How to run

> Not implemented yet. See [DESIGN.md](./DESIGN.md) and implement step by step.

```bash
# Planned commands
docker compose up -d
cd node && npm install
npm run producer    # terminal 1
npm run worker      # terminal 2
```

## Learnings

_Document what you learned after each session._

## Next

Once this lab is `done`, move to [notification-system](../../../lld/notification-system/).
