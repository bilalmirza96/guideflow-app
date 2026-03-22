# Skill: Guideline Upload

## When to Use
When implementing or modifying the guideline upload/creation flow.

## Input Modes (Priority Order)

1. **PDF/DOCX file upload** — drag-drop zone, upload to R2, parse with `unpdf`
2. **Rich text editor** — direct text input, stored as content in DB
3. **Copy-paste from Word/email** — paste into textarea, sanitize HTML
4. **URL import** — fetch external URL, extract content

## Upload Flow

```
User drops file → validate type/size → upload to R2 → parse text (unpdf) →
store metadata in `guidelines` table → set status draft/published → toast
```

## Validation Rules
- File types: `.pdf`, `.doc`, `.docx`, `.txt`, `.rtf`
- Max size: 25MB
- Title required, specialty required
- PDF URL stored as `guidelines.pdf_url`
- Parsed text stored as `guidelines.content` for search indexing

## R2 Storage Path
```
guidelines/{hospital_id}/{guideline_id}/{filename}
```

## Database Fields
See `docs/schema.md` → `guidelines` table

## Admin-Only
- Check `user.role === 'hospital_admin'` before allowing upload
- Middleware should enforce this at the API route level
