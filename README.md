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
- Package-specific post-payment flow: the £49 AI Tailored CV & Role Report is self-serve, while the £249 Senior Finance Review moves into a human review workflow.
- Server-side report preparation with Gemini as the preferred AI provider, OpenAI as an optional fallback and deterministic generation as the internal safety fallback for the £49 product.
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
5. For the £49 AI Tailored CV & Role Report, the customer prepares the report from the success page or `/report?orderId=...`.
6. The server verifies the paid order and package before generating or returning report output.
7. The £49 report dashboard displays focused sections for Overview, Role Fit, CV Draft, Keywords, Interview Prep and Next Steps.
8. The £49 customer receives a signed private report link by email and can download the tailored role report and new CV draft.
9. For the £249 Senior Finance Review, the customer sees a confirmation/in-progress state and the final reviewed output is not released automatically in the self-serve report dashboard.

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

## Vercel Staging Deployment Checklist

Use a Vercel Preview deployment for staging before connecting live payment keys.

1. Push the current branch to GitHub and import the project into Vercel as a Next.js app.
2. In Vercel Project Settings, add the staging environment variables listed in `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to the Vercel Preview URL or a dedicated staging domain, without a trailing slash.
4. Run `supabase/schema.sql` against the staging Supabase project before testing checkout.
5. Confirm the private `cv-uploads` bucket exists with a 4MB file size limit.
6. In Stripe test mode, add a webhook endpoint for `https://your-staging-domain/api/stripe/webhook`.
7. Listen for `checkout.session.completed` and copy the Stripe webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
8. Configure Resend with a verified sender domain or sender email, then add `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
9. Add `INTERNAL_REVIEW_EMAIL` for Senior Finance Review notifications.
10. Add a strong random `REPORT_LINK_SECRET`; production and staging should not share the same value.
11. Deploy, then run one paid £49 test order and one paid £249 test order through Stripe test mode.
12. Confirm Supabase rows, private CV upload, report generation, signed report link, customer email and internal review email.

The API routes use the Node.js runtime. `next.config.ts` keeps `mammoth` and `pdf-parse` as server external packages so PDF/DOCX extraction can run server-side on Vercel.

### Vercel Environment Variables

Add these to the Vercel Preview environment for staging:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=
OPENAI_API_KEY=
OPENAI_MODEL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
INTERNAL_REVIEW_EMAIL=
REPORT_LINK_SECRET=
NEXT_PUBLIC_APP_URL=
```

`GEMINI_MODEL`, `OPENAI_API_KEY` and `OPENAI_MODEL` are optional for staging if Gemini is configured. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is present in `.env.example` for future client-side Stripe work, but the current Checkout Session flow does not require it.

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
- Maximum CV file size: 4MB.
- Uploaded files are stored in the private Supabase Storage bucket `cv-uploads`.
- The database stores file metadata and storage path, not a public URL.
- TXT, PDF and DOCX CV uploads are extracted server-side and saved to `intake_submissions.cv_text` when readable text is found.
- PDF extraction uses `pdf-parse`; DOCX extraction uses `mammoth.extractRawText`.
- If both pasted CV text and uploaded-file text are available, the longer usable text is saved as report evidence.
- Scanned, image-only, password-protected or unusually formatted PDFs may not produce usable text. In that case, users should paste CV text as well or upload a text-based PDF, DOCX or TXT file.

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

## Customer Email and Private Report Links

Add these values to enable customer emails, internal Senior Finance Review notifications and signed private report links:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
INTERNAL_REVIEW_EMAIL=
REPORT_LINK_SECRET=
```

For the £49 AI Tailored CV & Role Report, the app emails the customer at `orders.customer_email` after the paid report has been generated and saved. The email includes a signed private report link, not raw CV text or attachments.

Signed report links use a server-side token generated from `REPORT_LINK_SECRET`. A signed link still requires the underlying order to be paid, so it does not bypass payment/report gating. Local development can use the built-in development fallback, but production requires `REPORT_LINK_SECRET` before launch.

For the £249 Senior Finance Review, the app emails the customer at `orders.customer_email` with a review reference and confirmation that the review has entered the human-review workflow.

When a paid `senior-finance-review` order is confirmed, the app moves the order to `awaiting_human_review` and sends a safe internal notification when Resend is configured. The notification includes order and intake metadata, target role details, CV file metadata and intake notes, but does not include full CV text, private storage paths or API keys.

Premium internal review notifications are sent to the email address configured in `INTERNAL_REVIEW_EMAIL`.

If Resend is not configured or email cannot be sent, payment confirmation, report viewing and senior review confirmation still work. The app logs safe server-side diagnostics only.

Launch email risks are tracked in `RISK_REGISTER.md`.

## Suggested Next Build Steps

- Test signed report-link email delivery across both packages before launch.
- Review several real Gemini-generated reports against senior-finance quality standards.
- Add durable report delivery and support workflows for Senior Finance Review.
- Add an operations workflow for human review without adding customer authentication too early.

## Next Integrations

- Email delivery through a transactional email service.
- Confirmed data retention policy and deletion process.
- Human-review operations flow for the £249 Senior Finance Review.

Use `.env.example` as the starting point for future integration keys. The current app can run locally without every email variable configured, but production launch requires `REPORT_LINK_SECRET` for signed report links and Resend settings for email delivery.
