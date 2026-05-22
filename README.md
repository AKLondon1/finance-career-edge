# Finance Career Edge

Finance Career Edge is a premium Next.js app for UK finance professionals applying for senior finance roles.

## Current Product Flow

- Landing page with the corrected offers:
  - AI Tailored CV & Role Report, £49
  - Senior Finance Review, £249
- Public example output page at `/example-output` showing the dashboard-style report and CV draft structure.
- Low-friction intake form with package preselection via query string.
- Private Supabase Storage upload for PDF, DOCX and TXT CV files, plus a paste-CV alternative.
- Supabase-backed order storage for orders, intake submissions and generated report outputs.
- Stripe Checkout flow with server-side payment verification and webhook order updates.
- Server-side report access control so paid report output is only prepared for confirmed paid orders.
- Server-side report preparation with Gemini as the preferred AI provider, OpenAI as an optional fallback and deterministic generation as the internal safety fallback.
- Download buttons for the tailored role report and CV draft.
- Display-only regional price formatting for GBP, USD and EUR via browser locale or `?currency=GBP|USD|EUR`.
- Senior review page explaining the human quality layer.
- Launch-draft pages for privacy, terms and refund policy.

The app does not yet connect authentication, an admin dashboard, subscriptions or a blog.

## Paid Report Journey

1. The customer chooses a package and completes the intake form.
2. The app creates a Supabase order and intake submission.
3. The customer continues to Stripe Checkout.
4. Stripe confirms payment and the webhook marks the order as paid.
5. The customer prepares the report from the success page or `/report?orderId=...`.
6. The server verifies the paid order before generating or returning report output.
7. The report dashboard displays focused sections for Overview, Role Fit, CV Draft, Keywords, Interview Prep and Next Steps.
8. The customer can download the tailored role report and new CV draft.

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
3. Confirm the private `cv-uploads` Storage bucket exists.
4. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Keep the service role key server-side only. Do not expose it in client code.

The schema also adds metadata columns for uploaded CV files and a unique index on `report_outputs(order_id)` so report generation reuses the existing output for an order.

## CV Upload Handling

- Accepted CV formats: PDF, DOCX and TXT.
- Maximum CV file size: 5MB.
- Uploaded files are stored in the private Supabase Storage bucket `cv-uploads`.
- The database stores file metadata and storage path, not a public URL.
- Plain text CV uploads are extracted server-side and can be used as report evidence.
- PDF and DOCX text extraction is not connected yet, so users should paste CV text as well when they want the AI report to use the full CV content immediately.

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

## AI Report Generation

Add these values to `.env.local` to use AI-backed report generation:

```bash
AI_PROVIDER=
GEMINI_API_KEY=
GEMINI_MODEL=
OPENAI_API_KEY=
OPENAI_MODEL=
```

`AI_PROVIDER` can be `gemini`, `openai` or `deterministic`. Gemini is the preferred provider. If `AI_PROVIDER` is not set, the app uses Gemini when `GEMINI_API_KEY` is present, then OpenAI when `OPENAI_API_KEY` is present, then the internal deterministic generator. `GEMINI_MODEL` and `OPENAI_MODEL` are optional; defaults are configured server-side in `lib/ai/generate-report.ts`.

The AI layer validates the generated report shape before storing it. If a selected AI provider cannot complete generation or the response cannot be validated, the app falls back safely so paid report preparation remains available.

AI calls are server-side only. Do not expose `GEMINI_API_KEY` or `OPENAI_API_KEY` in client code.

## Resend Setup Later

Add these values when email delivery is ready:

```bash
RESEND_API_KEY=
SUPPORT_EMAIL=support@financecareeredge.com
```

The email route is prepared for report-ready delivery and returns safely when email is not configured.

## Suggested Next Build Steps

- Add PDF and DOCX text extraction for uploaded CVs.
- Add email delivery for payment confirmation and report-ready notifications.
- Review several real Gemini-generated reports against senior-finance quality standards.
- Add durable report delivery and support workflows for Senior Finance Review.
- Add an operations workflow for human review without adding customer authentication too early.

## Next Integrations

- Email delivery through a transactional email service.
- PDF/DOCX document parsing for uploaded CV documents.
- Confirmed data retention policy and deletion process.
- Human-review operations flow for the £249 Senior Finance Review.

Use `.env.example` as the starting point for future integration keys. The current app does not require these environment variables to run.
