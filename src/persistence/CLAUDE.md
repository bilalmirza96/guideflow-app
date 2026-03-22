# Persistence Module

## Purpose
Database access layer. Drizzle ORM schema, queries, and helpers.

## Files
- `schema.ts` — Drizzle table definitions (see `docs/schema.md`)
- `db.ts` — Neon connection + Drizzle instance
- `queries/` — per-table query functions

## Rules
- EVERY query function takes `hospitalId` as first parameter
- Use `eq()` and `and()` from Drizzle for type-safe filtering
- Never expose raw SQL — always go through Drizzle
- Connection via `@neondatabase/serverless` + `drizzle-orm/neon-serverless`

## Example
```typescript
import { db } from './db';
import { guidelines } from './schema';
import { eq, and, ilike } from 'drizzle-orm';

export async function getGuidelines(hospitalId: string, search?: string) {
  const conditions = [eq(guidelines.hospital_id, hospitalId)];
  if (search) conditions.push(ilike(guidelines.title, `%${search}%`));
  
  return db.select().from(guidelines).where(and(...conditions));
}
```
