// Customer-facing copy, taken from reem-solutions-landing-page-brief.md §3.
// Prices and capacity are draft hypotheses; settle before launch.

export type Engagement = "audit" | "sprint" | "support" | "partnership" | "help";

export const engagementOptions: { value: Engagement; label: string }[] = [
  { value: "audit", label: "Audit" },
  { value: "sprint", label: "Production sprint" },
  { value: "support", label: "Ongoing support" },
  { value: "partnership", label: "Agency partnership" },
  { value: "help", label: "Help choosing" },
];

export const nav = {
  links: [
    { href: "#services", label: "Services", id: "services" },
    { href: "#how-we-work", label: "How we work", id: "how-we-work" },
    { href: "#faqs", label: "FAQs", id: "faqs" },
  ],
  cta: "Discuss your project",
};

export const hero = {
  eyebrow: "AI production engineering for SaaS teams",
  headline: "Ship AI that holds up in production.",
  copy: "We help you turn a working AI prototype into a live product with tested releases, clear operating costs and ongoing engineering support.",
  primary: "Discuss your project",
  secondary: "See how we work",
  support: ["A named technical owner.", "Weekly demos.", "Documented handover."],
};

export const problems = {
  headline: "Get ready for the things real users bring.",
  intro:
    "More requests. Messier inputs. Unexpected failures. We work through the engineering details that determine whether your AI feature is ready to launch.",
  items: [
    { label: "Quality", copy: "Test the responses and behaviours your users depend on." },
    { label: "Performance", copy: "Understand latency, load and failure paths before launch." },
    { label: "Cost", copy: "See how cloud and model usage translate into operating costs." },
    { label: "Operations", copy: "Give your team visibility, alerts and a plan when something breaks." },
  ],
};

export const deliverables = {
  headline: "A release your team can understand and operate.",
  intro:
    "We agree the acceptance criteria at the start and deliver the evidence, tooling and documentation alongside the implementation.",
  items: [
    { label: "Repeatable deployment", copy: "A documented release path with checks and a tested rollback process." },
    { label: "Evaluation evidence", copy: "Tests for agreed AI behaviours, with results your team can review." },
    { label: "Operational visibility", copy: "Logs, alerts and visibility into quality, latency and usage costs." },
    { label: "Handover", copy: "Architecture notes, runbooks and a walkthrough with your team." },
  ],
  closing: "Your cloud and model accounts stay under your control.",
};

export const engagements = {
  headline: "Start with the right level of support.",
  intro: "Begin with an audit, scope an implementation sprint or bring us in to support a live workload.",
  offers: [
    {
      n: "01",
      name: "Production Readiness Audit",
      pricePrefix: "",
      price: "£2,500",
      priceSuffix: "",
      timing: "5 working days from agreed access and kickoff",
      description:
        "Get a prioritised view of the engineering work needed to take your existing AI workload into production.",
      included: [
        "Architecture and risk review",
        "Review of deployment, evaluation and monitoring gaps",
        "Prioritised recommendations and an implementation plan",
      ],
      cta: "Discuss an audit",
      engagement: "audit" as Engagement,
      scope: "One agreed workload. Up to 20 delivery hours.",
    },
    {
      n: "02",
      name: "AI Production Sprint",
      pricePrefix: "From",
      price: "£20,000",
      priceSuffix: "",
      timing: "Typically 4–6 weeks, subject to scope and access",
      description: "Take an agreed AI workload through implementation, validation and a controlled release.",
      included: [
        "Deployment and release checks",
        "AI evaluations and operational monitoring",
        "Acceptance evidence, runbooks and handover",
      ],
      cta: "Scope a sprint",
      engagement: "sprint" as Engagement,
      scope:
        "One workload and agreed integrations. The quoted scope sets the delivery capacity and acceptance criteria.",
    },
    {
      n: "03",
      name: "Managed AI Operations",
      pricePrefix: "From",
      price: "£3,500",
      priceSuffix: "per month",
      timing: "UK business-hours coverage",
      description:
        "Keep an agreed live workload supported with incident triage, maintenance and planned improvements.",
      included: [
        "Monitoring and incident triage",
        "Agreed maintenance and improvements",
        "Monthly reliability and usage-cost review",
      ],
      cta: "Discuss ongoing support",
      engagement: "support" as Engagement,
      scope:
        "Base package includes up to 40 delivery hours per month. Response targets and overage are agreed in the contract.",
    },
  ],
  note: "Prices exclude VAT where applicable. Cloud and model usage are billed through your own accounts. If your audit leads to an implementation sprint with us, its fee is credited against the agreed sprint price. Continuous on-call coverage is quoted separately.",
};

export const process = {
  headline: "You can see the work as it happens.",
  intro: "One technical owner, agreed milestones and a client demo every week.",
  stages: [
    { n: "01", label: "Understand", copy: "Review the workload, constraints and launch requirements." },
    { n: "02", label: "Agree", copy: "Define the scope, architecture and acceptance criteria." },
    { n: "03", label: "Build", copy: "Implement the release path, evaluations and operational controls." },
    { n: "04", label: "Validate", copy: "Review test results, failure paths and client acceptance." },
    { n: "05", label: "Release", copy: "Go live with a documented handover and an agreed support plan." },
  ],
  closing: "Scope changes come with an agreed cost and schedule impact before work begins.",
};

export const agency = {
  headline: "Production engineering for your client projects.",
  copy: "Bring reem into a client engagement for deployment, validation and ongoing operations. We agree responsibilities, communication and handover around your delivery model.",
  cta: "Discuss a partnership",
};

export const faqs = [
  {
    q: "Do we need a working AI prototype?",
    a: "This service is designed for teams with an existing prototype, feature or workload. If you are starting earlier, we can discuss what needs to be in place before a production sprint.",
  },
  {
    q: "Can you work with our existing engineers?",
    a: "Yes. We agree responsibilities with your team and work within the tools, review process and access arrangements set for the project.",
  },
  {
    q: "What happens during the first conversation?",
    a: "We discuss your current workload, the launch or operating problem, the timeline and the engineering support you need. From there, we recommend an audit, a scoped sprint or an operations engagement.",
  },
  {
    q: "Who controls our infrastructure?",
    a: "Your cloud and model accounts stay under your control. Project access, documentation and IP terms are agreed before delivery begins.",
  },
  {
    q: "How long does a sprint take?",
    a: "A bounded workload will typically be scoped for 4–6 weeks. We confirm the schedule after reviewing integrations, access and acceptance requirements.",
  },
  {
    q: "Do you offer round-the-clock support?",
    a: "The base operations package covers UK business hours. Continuous on-call coverage needs a separate staffed arrangement and quote.",
  },
  {
    q: "How do you handle client data?",
    a: "We agree data access, processing responsibilities and any subcontractor access before work begins. Your project’s data requirements determine the hosting and delivery arrangements.",
  },
  {
    q: "Can we engage you for the audit only?",
    a: "Yes. The audit produces recommendations and an implementation plan your team can use. If you proceed to a sprint with us, the audit fee is credited against the agreed sprint price.",
  },
];

export const enquiry = {
  headline: "Tell us what you’re trying to launch.",
  copy: "Share where the product is today, what needs to improve and when you want it live. We’ll use that context to discuss the right next step.",
  submit: "Send project enquiry",
  success: "Thanks. Your enquiry has been sent. We’ll review your project details and follow up by email.",
  error: "Your enquiry could not be sent. Please try again.",
};

export const footer = {
  descriptor: "AI production engineering for SaaS teams.",
};
