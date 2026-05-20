# Finance Career Edge

Finance Career Edge is a premium Next.js app for UK finance professionals applying for senior finance roles.

## Current Product Flow

- Landing page with the corrected offers:
  - AI Tailored CV & Role Report, £49
  - Senior Finance Review, £249
- Public example output page at `/example-output` showing the dashboard-style report and CV draft structure.
- Low-friction intake form with package preselection via query string.
- Client-side CV file selection UI plus paste-CV alternative.
- Supabase-ready order storage with a development fallback when server keys are not configured.
- Stripe Checkout flow with server-side payment verification and webhook-ready order updates.
- Server-side report preparation endpoint with deterministic generation by default.
- Download buttons for the tailored role report and CV draft.
- Display-only regional price formatting for GBP, USD and EUR via browser locale or `?currency=GBP|USD|EUR`.
- Senior review page explaining the human quality layer.
- Launch-draft pages for privacy, terms and refund policy.

The app does not yet connect authentication, real file storage, an admin dashboard, subscriptions or a blog.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

Run TypeScript checks:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Keep the service role key server-side only. Do not expose it in client code.

## Stripe Checkout Setup

1. Create a Stripe account or use an existing account.
2. Use Stripe test mode while developing locally.
3. Add `STRIPE_SECRET_KEY` to `.env.local`.
4. Add `NEXT_PUBLIC_APP_URL=http://localhost:3000` to `.env.local`.
5. Run `npm run dev`.
6. Start a review from the app and complete Stripe checkout.
7. Do not use live keys until the product is ready for live payments.

## Stripe Webhook Local Testing

1. Add `STRIPE_WEBHOOK_SECRET` to `.env.local`.
2. Point Stripe webhook events to `/api/stripe/webhook`.
3. Listen for `checkout.session.completed`.
4. The webhook marks the matching order as paid and keeps report preparation ready.

## OpenAI Setup Later

Add `OPENAI_API_KEY` to `.env.local` when moving report generation from the deterministic generator to an AI workflow. The current server-side generation structure is ready for that change and still runs without the key.

## Resend Setup Later

Add these values when email delivery is ready:

```bash
RESEND_API_KEY=
SUPPORT_EMAIL=support@financecareeredge.com
```

The email route is prepared for report-ready delivery and returns safely when email is not configured.

## Suggested Next Build Steps

- Connect secure file upload and document parsing.
- Replace deterministic report generation with the server-side AI workflow.
- Add durable report delivery and support workflows for Senior Finance Review.

## Next Integrations

- OpenAI report generation using the current local report model as the response shape.
- Email delivery through a transactional email service.
- Secure file storage for uploaded CV documents.
- Confirmed data retention policy and deletion process.

Use `.env.example` as the starting point for future integration keys. The current app does not require these environment variables to run.
