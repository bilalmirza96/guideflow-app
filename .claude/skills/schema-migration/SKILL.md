# Skill: Schema Migration

## When to Use
When adding or modifying database tables, columns, or indexes.

## Process

1. **Edit schema** — modify Drizzle schema in `src/persistence/schema.ts`
2. **Generate migration** — `npx drizzle-kit generate`
3. **Review SQL** — check the generated migration file in `drizzle/` folder
4. **Test locally** — `npx drizzle-kit push` against dev database
5. **Verify** — `npx drizzle-kit studio` to inspect tables
6. **Update docs** — sync `docs/schema.md` with any changes
7. **Commit** — include both schema change and migration file

## Rules
- NEVER drop columns in production without a migration plan
- Always add `hospital_id` FK to new tenant-scoped tables
- Add indexes for any column used in WHERE clauses
- Use `uuid` for all primary keys
- Use `timestamp` with `defaultNow()` for `created_at`
- Every new table needs a corresponding Zod validation schema

## Rollback
```bash
# Drizzle doesn't auto-rollback — keep the previous migration SQL handy
# For emergencies: manual SQL against Neon dashboard
```
