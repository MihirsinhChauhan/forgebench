# Lab conventions

Personal rules for how labs are structured in this repo.

## Lab folder template

```
<category>/<lab-name>/
├── DESIGN.md       # Problem, constraints, approach, tradeoffs (write first)
├── README.md       # How to run, deps, what you learned
├── python/         # Optional — same problem, different language
├── go/
├── node/
└── solution/       # Optional — reference impl after you've tried
```

## DESIGN.md checklist

- [ ] Functional requirements
- [ ] Non-functional requirements (latency, scale, failure modes)
- [ ] API / interface sketch
- [ ] Data model
- [ ] Approach + alternatives considered
- [ ] Edge cases
- [ ] What you'd do differently in production

## Rules

1. **One concept per folder** — keep labs focused and copy-pasteable
2. **Design before code** — `DESIGN.md` exists before implementation
3. **Self-contained deps** — each lab owns its `package.json` / `go.mod` / `pyproject.toml`
4. **No secrets** — use `.env.example`, never commit real credentials
5. **Production-shaped, not production** — real structure (tests, config, errors) without over-engineering
6. **Document learnings** — update the lab `README.md` after each session

## Naming

- Folders: `kebab-case` (e.g. `rate-limiter`, `worker-pool`)
- Go packages: short, single-purpose
- Python modules: snake_case
- Node: camelCase for code, kebab-case for folders

## Status labels (use in lab README)

- `draft` — DESIGN only
- `wip` — implementing
- `done` — runnable, documented
- `reference` — solution/ folder complete, ready to copy
