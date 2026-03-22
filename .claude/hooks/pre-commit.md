# Pre-Commit Hook

## Before committing, verify:

1. **No hardcoded secrets** — scan for API keys, tokens, passwords
2. **Tenant scoping** — every new Drizzle query includes `hospital_id` filter
3. **Type safety** — `npm run typecheck` passes
4. **Lint clean** — `npm run lint` passes
5. **Tests pass** — `npm run test` passes
6. **Schema sync** — if schema changed, migration file exists

## Auto-checks to run:
```bash
npm run typecheck
npm run lint
grep -r "RESEND_API_KEY\|JWT_SECRET" src/ --include="*.ts" --include="*.tsx"
```
