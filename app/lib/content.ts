export const SITE_URL = "https://mediawisesolutions.au";
export const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/4a69841c8fbc4250b52e5adc7d888f46@mediawisesolutions.au?anonymous";
export const ENQUIRY_FORM_URL = "https://form.jotform.com/263265831275057";
export const EMAIL = "mitch@mediawisesolutions.au";
export const PHONE = "0409 265 711";
export const PHONE_HREF = "tel:+61409265711";
export const ABN = "27 565 980 600";

export type Offer = {
  slug: string;
  number: string;
  name: string;
  headline: string;
  problem: string;
  fixes: string;
  included: string[];
  excluded: string[];
  measure: string;
  price: number;
  carePlan: number;
  weeks: number;
  goLiveDay: number;
};

export const offers: Offer[] = [
  {
    slug: "never-miss-an-enquiry",
    number: "01",
    name: "Never miss an enquiry",
    headline: "Every missed call is a job for someone else.",
    problem:
      "You're on the tools, on the floor or with a customer, and the phone goes to voicemail. Web enquiries sit there overnight. By the time you call back, they've booked someone who answered.",
    fixes:
      "Every enquiry gets an instant reply, lands in one list, and can book straight into your calendar.",
    included: [
      "Missed call text back from your business number, with a booking or callback link",
      "Website and Facebook enquiry forms routed into one lead list",
      "An instant reply to every web enquiry, plus an alert to you or your team",
      "Online booking linked to your calendar",
      "A weekly summary of enquiries received, answered and booked",
    ],
    excluded: [
      "Voice AI receptionists (quoted separately)",
      "New websites, call centres or answering services",
      "More than 2 lead sources ($250 each after that)",
    ],
    measure: "Enquiries captured each week, and how fast you reply",
    price: 1950,
    carePlan: 195,
    weeks: 2,
    goLiveDay: 10,
  },
  {
    slug: "quotes-out-the-same-day",
    number: "02",
    name: "Quotes out the same day",
    headline: "Quotes out the same day. Chased for you.",
    problem:
      "Quotes get built by hand at 9pm, and the ones that go quiet never get followed up. That's work you've already earned walking out the door.",
    fixes:
      "Job details are captured once, the quote builds from a template, and follow ups go out on their own.",
    included: [
      "One job intake form, on the web or a tablet",
      "Up to 3 branded quote templates in your quoting or job system (or Word if you have none)",
      "Quotes generated automatically from the intake form",
      "Follow ups at day 2 and day 5 by email and SMS, stopping when the quote is accepted",
      "A quote register showing sent, won and lost, with your weekly win rate",
    ],
    excluded: [
      "Pricing strategy or rate card changes",
      "More than 3 templates ($350 each after that)",
      "Moving old quotes across",
    ],
    measure: "Time from enquiry to quote sent, and your quote win rate",
    price: 2950,
    carePlan: 195,
    weeks: 3,
    goLiveDay: 15,
  },
  {
    slug: "get-paid-faster",
    number: "03",
    name: "Get paid faster",
    headline: "Stop chasing invoices. Get paid faster.",
    problem:
      "Chasing money is awkward, so it doesn't happen until cash gets tight. Meanwhile invoices drift past 30, 60, 90 days.",
    fixes:
      "Your accounting system does the follow ups, politely and on time, and every invoice carries a pay now link.",
    included: [
      "Staged reminders in Xero or MYOB: before due, on the day, and 7 and 14 days overdue",
      "Reminder wording rewritten to sound like you",
      "A pay now link on every invoice",
      "A weekly list of who owes you what",
      "An alert for anything more than 30 days overdue",
    ],
    excluded: [
      "Debt collection or legal recovery",
      "Bookkeeping or reconciling past accounts",
      "Changes to your credit terms",
    ],
    measure: "Average days to get paid, and dollars more than 30 days overdue",
    price: 1450,
    carePlan: 145,
    weeks: 2,
    goLiveDay: 10,
  },
  {
    slug: "onboarding-on-autopilot",
    number: "04",
    name: "Onboarding on autopilot",
    headline: "New starters. No paper. No chasing.",
    problem:
      "Contracts printed and lost, tax and super forms half filled in, and nobody knows whose white card or RSA runs out next month.",
    fixes:
      "One digital pack gets a new starter ready before their first shift, and you're warned before any licence expires.",
    included: [
      "A digital onboarding pack: contract, TFN declaration, super choice, bank details and emergency contact",
      "E-signature on the employment contract",
      "An induction checklist with sign off, stored against each staff member",
      "A licence and ticket register (RSA, white card, first aid) with alerts 30 days before expiry",
      "New starter details passed to your payroll or rostering system, where it connects",
    ],
    excluded: [
      "Writing employment contracts or policies",
      "Award interpretation or HR advice",
      "Payroll setup, or more than 2 role types ($300 each after that)",
    ],
    measure: "Hours from offer accepted to ready to work, and expired or missing tickets",
    price: 2950,
    carePlan: 195,
    weeks: 3,
    goLiveDay: 15,
  },
  {
    slug: "monday-morning-numbers",
    number: "05",
    name: "Monday morning numbers",
    headline: "Your whole business on one page. Every Monday.",
    problem:
      "Your numbers live in five different systems, so you only find out how last month went when the accountant tells you.",
    fixes:
      "One page lands in your inbox every Monday with the numbers that matter, pulled from the systems you already use.",
    included: [
      "A one page dashboard with up to 8 measures, such as revenue, wages percentage, cash, debtors and pipeline",
      "Connections to up to 3 data sources: accounting, POS or job system, rostering",
      "Automatic refresh and a Monday morning email",
      "One round of changes to the layout and measures",
    ],
    excluded: [
      "Cleaning or rebuilding old data",
      "More than 3 data sources ($400 each after that)",
      "Custom forecasting models",
    ],
    measure: "Hours a week you spend pulling numbers together",
    price: 2450,
    carePlan: 295,
    weeks: 3,
    goLiveDay: 15,
  },
];

export const bundles = [
  { name: "Starter", includes: "01 and 03", price: 2950, carePlan: 295, saving: 450 },
  { name: "Growth", includes: "01, 02 and 03", price: 5450, carePlan: 445, saving: 900 },
  { name: "Full system", includes: "All five", price: 9750, carePlan: 695, saving: 2000 },
];

export type Area = {
  slug: string;
  name: string;
  stages: string;
  tone: "gold" | "teal" | "blue";
  headline: string;
  intro: string;
  leaks: string[];
  work: { title: string; body: string }[];
  formats: string[];
};

export const areas: Area[] = [
  {
    slug: "marketing",
    name: "Marketing",
    stages: "Get found",
    tone: "gold",
    headline: "Marketing that's judged on the work it brings in.",
    intro:
      "Most businesses your size spend real money on marketing every month and can't say what comes back. I set the strategy, run the campaigns or lead your team, and tie every dollar to enquiries and revenue.",
    leaks: [
      "Ad spend nobody can tie back to a sale",
      "An agency report full of reach and impressions, and no mention of jobs",
      "Campaigns that start strong and stop when things get busy",
      "Enquiries arriving from five places with no one tracking where they came from",
    ],
    work: [
      { title: "Marketing strategy", body: "A plan built backwards from your revenue target: who you're chasing, what you say to them, where, and what it should cost per enquiry." },
      { title: "Campaigns", body: "Google, Meta and local media campaigns, planned and run properly, with the tracking set up before a dollar is spent." },
      { title: "Reporting", body: "One page you can read in five minutes: spend, enquiries, cost per enquiry and the work it turned into." },
      { title: "Fractional marketing leadership", body: "A part time head of marketing who sits in your leadership meetings, manages suppliers and keeps the plan moving." },
    ],
    formats: ["Fixed price strategy projects", "Monthly campaign management", "Part time marketing lead"],
  },
  {
    slug: "revenue-and-sales",
    name: "Revenue and sales",
    stages: "Win the work",
    tone: "teal",
    headline: "Win more of the work you're already paying to attract.",
    intro:
      "Once the enquiries are coming in, the money is won or lost in the follow up. I spent a decade running regional sales teams. I find where work slips through and build a sales rhythm your team will actually follow.",
    leaks: [
      "Quotes that go quiet and never get chased",
      "A pipeline that lives in heads, inboxes and the back of a diary",
      "Pricing that hasn't been looked at in years",
      "Good salespeople with no process, and no way to tell who's doing well",
    ],
    work: [
      { title: "Revenue diagnostics", body: "A clear look at where revenue comes from, where it leaks and what the fixes are worth, in order of payback." },
      { title: "Sales process and pipeline", body: "Stages, follow up rules and a CRM set up so every opportunity has an owner and a next step." },
      { title: "Sales team coaching", body: "Coaching and training for your team from someone who has carried a target and led a team of 12." },
      { title: "Pricing and quoting reviews", body: "How you price, how you quote and how fast it goes out, compared with what wins." },
    ],
    formats: ["Fixed price diagnostics", "Sales process builds", "Ongoing coaching", "Part time revenue lead"],
  },
  {
    slug: "systems-and-automation",
    name: "Systems and automation",
    stages: "Deliver it and get paid",
    tone: "blue",
    headline: "Deliver and bill without the double handling.",
    intro:
      "The handoffs between enquiry, job, invoice and payment are where hours quietly disappear. I build them in Power Automate on Microsoft 365 and connect the tools you already pay for, so the work moves on its own.",
    leaks: [
      "The same job keyed into three different systems",
      "Invoices sitting at 45 days because nobody had time to chase",
      "New starters onboarded from a folder of old PDFs",
      "Finding out how last month went when the accountant tells you",
    ],
    work: [
      { title: "Fixed price builds", body: "Five common fixes with a set scope and price, live in 2 to 3 weeks. Enquiries, quotes, invoices, onboarding and weekly numbers." },
      { title: "Custom workflows", body: "Approvals, job handoffs, reporting and anything else that runs on copy and paste, built across your systems." },
      { title: "Systems review", body: "A map of the tools you pay for, what each one should be doing, and where they should talk to each other." },
      { title: "Care plans", body: "Monitoring, fixes when a connected app changes, and small improvements each month." },
    ],
    formats: ["Five fixed price builds", "Custom projects", "Monthly care plans"],
  },
];

export const aud = (n: number) => `$${n.toLocaleString("en-AU")}`;
