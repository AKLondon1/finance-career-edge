export function buildReviewReference(orderId: string) {
  return `FCE-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
