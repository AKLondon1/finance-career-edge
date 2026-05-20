import { LegalPage } from "@/components/LegalPage";

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Refunds"
      title="Refund Policy"
      intro="This policy explains how refund requests should be reviewed for Finance Career Edge services."
      sections={[
        {
          title: "Digital service",
          body: [
            "Finance Career Edge provides a digital review service. Once a tailored report, CV draft or senior review has been prepared, the service has begun.",
          ],
        },
        {
          title: "Refund review conditions",
          body: [
            "Refund requests should be reviewed fairly where a service has not been provided, where there has been a clear processing issue, or where support is required to resolve a delivery concern.",
            "Requests should include the email used for the intake, selected package and a clear explanation of the issue.",
          ],
        },
        {
          title: "Hiring outcomes",
          body: [
            "Refunds are not based on whether an interview or job offer is received. No application support service can guarantee hiring outcomes.",
          ],
        },
        {
          title: "Support",
          body: [
            "If there is an issue with a report or review, contact support so the concern can be assessed.",
            "Contact: support@financecareeredge.com",
          ],
        },
      ]}
    />
  );
}
