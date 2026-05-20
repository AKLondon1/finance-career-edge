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
          ],
        },
        {
          title: "How information is used",
          body: [
            "Information is used to prepare your tailored role report, new CV draft, interview talking points and application recommendations.",
            "Where Senior Finance Review is selected, the information is also used to support the human quality review.",
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
            "Submitted information should be retained only for as long as needed to provide the service, respond to support queries and meet reasonable operational requirements.",
            "A detailed retention schedule should be confirmed before live payment and storage services are connected.",
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
