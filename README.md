# Finance Career Edge

Finance Career Edge is a premium Next.js app for UK finance professionals applying for senior finance roles.

## Current Product Flow

- Landing page with the corrected offers:
  - AI Tailored CV & Role Report, £49
  - Senior Finance Review, £249
- Low-friction intake form with package preselection via query string.
- Client-side CV file selection UI plus paste-CV alternative.
- Display-only regional price formatting for GBP, USD and EUR via browser locale or `?currency=GBP|USD|EUR`.
- Static example report showing a tailored role report, improved CV draft, interview prep and next steps.
- Senior review page explaining the human quality layer.

The app does not yet connect authentication, Stripe, Supabase, OpenAI API calls, real file storage, a dashboard, subscriptions or a blog.

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

## Suggested Next Build Steps

- Connect secure file upload and document parsing.
- Generate the tailored report and CV draft through a server-side AI workflow.
- Add Stripe checkout for the two products.
- Add privacy, terms and refund policy pages.
- Add secure submission storage and delivery workflow for the Senior Finance Review.
