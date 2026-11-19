# Forgebench

A personal lab repo for backend fundamentals, low-level design, and reusable patterns — built to think with code, not just prompt with it.

## What this is

Not a monolith. Not a tutorial clone. A **pattern library + experiment notebook** where each lab is:

- Runnable in isolation
- Designed before implemented (`DESIGN.md`)
- Copy-paste friendly into real projects

## Stack

| Area | Tech |
|------|------|
| Backend | Python, Go, Node |
| Mobile | React Native |
| Web | Next.js, React |
| Infra | Redis, BullMQ, RabbitMQ, AWS Lambda, S3 |
| AI | Python, LangGraph, LangChain, LiveKit |

## Structure

```
forgebench/
├── fundamentals/     # CS + backend primitives (concurrency, DBs, networking)
├── lld/              # Low-level design exercises with DESIGN.md
├── patterns/         # Reusable building blocks per language
├── integrations/     # Infra wiring (Redis, RabbitMQ, AWS, AI)
├── apps/             # End-to-end mini products
├── mobile/           # React Native labs
├── web/              # Next.js / React labs
├── snippets/         # Drop-in utilities (retry, idempotency, etc.)
└── notes/            # Mental models, cheat sheets
```

## Labs index

| Lab | Path | Status |
|-----|------|--------|
| BullMQ queue fundamentals | [integrations/bullmq/queue-fundamentals](./integrations/bullmq/queue-fundamentals/) | `draft` |
| Mini notification service | [lld/notification-system](./lld/notification-system/) | `draft` |

## How to use

1. Pick a lab from the index (or start a new one)
2. Read `DESIGN.md` — requirements, tradeoffs, API sketch
3. Implement in the language folder (`python/`, `go/`, `node/`)
4. Run it, break it, document what you learned in `README.md`
5. Lift the code into a real project when needed

## Practice workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for lab conventions and folder templates.

## Quick start

```bash
# Each lab is self-contained — cd into it and follow its README
cd integrations/bullmq/queue-fundamentals
```
