# Deploying to Cloudflare Pages

This Next.js app is configured to run on Cloudflare Pages with full server-side functionality.

## Prerequisites

1. Install Wrangler CLI globally:
   \`\`\`bash
   npm install -g wrangler
   \`\`\`

2. Login to Cloudflare:
   \`\`\`bash
   wrangler login
   \`\`\`

## Local Development

Run the app locally with Cloudflare Workers simulation:
\`\`\`bash
npm run preview
\`\`\`

## Build for Cloudflare

Build the app for Cloudflare Pages:
\`\`\`bash
npm run pages:build
\`\`\`

This creates a `.vercel/output/static` directory with your built app.

## Deploy to Cloudflare Pages

### Option 1: Command Line Deployment

\`\`\`bash
npm run deploy
\`\`\`

### Option 2: Cloudflare Dashboard

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Create a new project
3. Connect your Git repository
4. Set build settings:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/`

## Environment Variables

Add these environment variables in Cloudflare Pages dashboard:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Important Notes

- API routes run as Cloudflare Workers
- Stripe webhooks will need to be updated to your Cloudflare Pages URL
- All server-side features (API routes, dynamic rendering) are fully supported
- The app uses Edge Runtime for optimal performance on Cloudflare's network
