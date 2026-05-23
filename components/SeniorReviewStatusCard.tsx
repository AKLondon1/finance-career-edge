"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { buildReviewReference } from "@/lib/review-reference";

type SeniorReviewStatusCardProps = {
  actionHref?: string;
  actionLabel?: string;
  orderId?: string;
  targetCompany?: string;
  targetRole?: string;
};

export function SeniorReviewStatusCard({
  actionHref,
  actionLabel = "View review status",
  orderId,
  targetCompany,
  targetRole,
}: SeniorReviewStatusCardProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const reviewReference = orderId ? buildReviewReference(orderId) : null;

  async function handleCopyReference() {
    if (!reviewReference) {
      return;
    }

    try {
      await navigator.clipboard.writeText(reviewReference);
      setCopyMessage("Reference copied.");
    } catch {
      setCopyMessage("Copy was not available in this browser. Please note the reference above.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
        Senior Finance Review
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        Your Senior Finance Review is underway.
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-soft">
        Payment has been received and your CV and role details have been submitted for
        review.
      </p>

      {targetRole ? (
        <div className="mx-auto mt-6 max-w-xl rounded-[1.5rem] border border-spruce/15 bg-spruce-soft p-4 text-left text-sm leading-6 text-ink-soft">
          <p className="font-semibold text-ink">Application focus</p>
          <p className="mt-1">
            {targetRole}
            {targetCompany ? ` at ${targetCompany}` : ""}
          </p>
        </div>
      ) : null}

      {reviewReference ? (
        <div className="mx-auto mt-6 max-w-xl rounded-[1.5rem] border border-ink/10 bg-porcelain p-4 text-left text-sm leading-6 text-ink-soft">
          <p className="font-semibold text-ink">Review reference</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-base font-semibold text-ink">{reviewReference}</p>
            <Button
              className="min-h-10 px-4 py-2"
              onClick={handleCopyReference}
              type="button"
              variant="secondary"
            >
              Copy reference
            </Button>
          </div>
          {copyMessage ? <p className="mt-2 text-xs text-ink-soft">{copyMessage}</p> : null}
        </div>
      ) : null}

      <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
        {[
          {
            title: "Credibility",
            text: "Human judgement on whether the application reads credibly for a senior finance audience.",
          },
          {
            title: "Commercial positioning",
            text: "Review of how clearly margin, cash, forecast accuracy, controls and decision support are positioned.",
          },
          {
            title: "Role-fit",
            text: "A check that the final direction is shaped around the target role and its priorities.",
          },
        ].map((item) => (
          <div
            className="rounded-[1.25rem] border border-ink/10 bg-porcelain p-4"
            key={item.title}
          >
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{item.text}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-ink-soft">
        You will receive reviewed output or next steps by email. The final output is not
        released automatically from this page.
      </p>

      {actionHref ? (
        <Button href={actionHref} className="mt-7">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
