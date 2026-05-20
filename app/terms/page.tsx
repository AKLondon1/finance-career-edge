import { LegalPage } from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms describe the intended use of Finance Career Edge and the responsibilities of users of the service."
      sections={[
        {
          title: "Service description",
          body: [
            "Finance Career Edge provides finance-specific CV and application review support for senior finance roles.",
            "The service may include a tailored role report, new CV draft, interview talking points, recommended next steps and, where selected, senior finance human review.",
          ],
        },
        {
          title: "AI-assisted outputs",
          body: [
            "Outputs may be AI-assisted and should be reviewed by the user before being used in any application.",
            "Users are responsible for checking accuracy, truthfulness and suitability of final application content.",
          ],
        },
        {
          title: "Human review option",
          body: [
            "Senior Finance Review adds a human quality layer focused on credibility, seniority, commercial nuance and role-fit.",
            "Human review does not replace the user's responsibility to ensure the final CV and application are accurate.",
          ],
        },
        {
          title: "No guarantee of outcomes",
          body: [
            "Finance Career Edge does not guarantee interviews, job offers, salary outcomes or employer responses.",
          ],
        },
        {
          title: "Acceptable use",
          body: [
            "Users should provide truthful information and must not submit content they do not have the right to use.",
            "The service should not be used to create misleading, false or deceptive application material.",
          ],
        },
        {
          title: "Limitations",
          body: [
            "The service is provided to support application preparation. It is not legal, financial or employment advice.",
          ],
        },
        {
          title: "Contact",
          body: ["Contact: support@financecareeredge.com"],
        },
      ]}
    />
  );
}
