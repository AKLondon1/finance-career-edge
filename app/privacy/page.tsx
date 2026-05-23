import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This page explains how Finance Career Edge handles information provided for a finance CV review."
      sections={[
        {
          title: "Information collected",
          body: [
            "We collect the information you provide through the intake form, including your name, email address, target role, CV content, selected package and any optional role context.",
            "CV and role information may include employment history, achievements, target company details, job advert text and your stated concerns about the application.",
            "If you upload a CV file, we store the file privately and keep related metadata such as file name, file type, file size and storage reference.",
          ],
        },
        {
          title: "How information is used",
          body: [
            "Information is used to prepare your tailored role report, new CV draft, interview talking points and application recommendations.",
            "Where Senior Finance Review is selected, the information is also used to support the human quality review.",
            "AI-assisted processing may be used to prepare report content, with deterministic internal generation available if an AI provider is not available.",
          ],
        },
        {
          title: "Storage and report links",
          body: [
            "Uploaded CV files are stored in private storage and are not made available through public file URLs.",
            "Private report links are signed server-side and still require the underlying order to be paid before report output is shown.",
          ],
        },
        {
          title: "Email",
          body: [
            "We may email payment, report-ready or Senior Finance Review updates to the email address provided during intake.",
            "Customer emails do not include full CV text or uploaded CV file contents.",
          ],
        },
        {
          title: "Sensitive information",
          body: [
            "Please do not provide unnecessary sensitive personal information. Only include details relevant to your finance application.",
          ],
        },
        {
          title: "Retention",
          body: [
            "Submitted information is retained only for as long as needed to provide the service, respond to support queries and meet reasonable operational requirements.",
            "A detailed retention and deletion process should be reviewed before broader launch.",
          ],
        },
        {
          title: "No hiring guarantee",
          body: [
            "Finance Career Edge improves application material and role alignment. It does not guarantee interviews, job offers or hiring outcomes.",
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
