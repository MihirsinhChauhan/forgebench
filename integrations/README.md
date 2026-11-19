# Integrations

Wiring real infra and third-party services. Focus on connection patterns, retries, and failure handling.

```
integrations/
├── bullmq/      # Redis-backed job queues (Node)
├── redis/       # caching, pub/sub, distributed locks
├── rabbitmq/    # pub/sub, work queues, dead letter
├── aws/         # Lambda, S3, event-driven pipelines
└── ai/          # LangGraph, LangChain, LiveKit
```

| Lab | Path | Status |
|-----|------|--------|
| BullMQ queue fundamentals | [bullmq/queue-fundamentals](./bullmq/queue-fundamentals/) | `draft` |

Each integration lab should include a `docker-compose.yml` or local dev setup where possible.
