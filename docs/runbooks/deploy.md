# Deploy Runbook

## Prerequisites

- Cloudflare account with Workers enabled
- Neon database provisioned
- R2 bucket created (`guideflow-uploads`)
- Resend API key for magic link emails

## Environment Variables

```env
DATABASE_URL=postgresql://...@neon.tech/guideflow
RESEND_API_KEY=re_...
JWT_SECRET=<random 64-char hex>
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=guideflow-uploads
```

## Deploy Steps

```bash
# 1. Push schema
npm run db:push

# 2. Build
npm run build

# 3. Deploy to Cloudflare
npx wrangler deploy
```

## Adding a New Hospital

1. Insert row into `hospitals` table with subdomain + name
2. Configure Cloudflare DNS: `*.pmg.app` CNAME → Workers route
3. Hospital admin receives invite email to set up their account
