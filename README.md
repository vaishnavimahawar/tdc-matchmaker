This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository# 💞 TDC Matchmaker — Intelligent Matchmaking Dashboard

<p align="center">
  <strong>A smarter way to discover meaningful connections.</strong>
  <br />
  An AI-powered matchmaking MVP built for <strong>The Date Crew (TDC)</strong>, combining Indian matchmaking preferences, explainable compatibility scoring, and a matchmaker-friendly dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Status-MVP-orange" alt="Project Status" />
  <img src="https://img.shields.io/badge/Domain-Matchmaking-pink" alt="Domain" />
</p>

---

## ✨ Overview

Finding the right match is about more than just browsing profiles. Matchmakers need a structured way to understand customer preferences, evaluate compatibility, and manage potential introductions.

**TDC Matchmaker** is a matchmaking dashboard MVP designed to streamline that process. It brings customer management, Indian matchmaking biodata, compatibility scoring, and match-sending workflows into one place.

The goal is simple: **make matchmaking more organized, explainable, and efficient — while keeping human judgment at the center.**

## 🚀 Features

### 📊 Matchmaker Dashboard
- View assigned customers in one organized workspace.
- Track customer-book metrics and matchmaking progress.
- Access customer profiles and their potential matches.
- Use a clean interface designed around the matchmaker workflow.

### 🪷 Indian Matchmaking Biodata
Profiles can capture important personal and compatibility preferences, including:

- Age, gender, and location
- Community and gotra
- Education and profession
- Diet and lifestyle preferences
- Family background
- Languages and personal values

These dimensions help represent the real-world context of Indian matchmaking.

### 🧠 Explainable Compatibility Scoring
The matching engine evaluates eligible candidates using multiple compatibility dimensions.

- **Eligibility checks:** Apply knockout rules before calculating compatibility.
- **Weighted scoring:** Combine compatibility dimensions into an overall score.
- **Match categories:** Organize results into understandable compatibility bands.
- **Dimension-level reasoning:** Help matchmakers understand the factors contributing to a potential match.

The current scoring bands are:

| Score | Compatibility band |
|---|---|
| 85–100 | Exceptional |
| 72–84 | Strong |
| 58–71 | Consider |
| Below 58 | Weak |
| Failed eligibility checks | Ineligible |

*These scores are decision-support signals, not guarantees of relationship success.*

### 💌 Matchmaking Workflow
- Explore eligible candidates from the candidate pool.
- Review compatibility results before making a decision.
- Support a mock **Send Match** action as part of the MVP workflow.

### 🔐 Demo Authentication
- Separate demo matchmaker accounts.
- Login-based access to the dashboard.
- Session handling for the demonstration workflow.

> **Note:** This MVP uses demo authentication and local JSON data. It is not production-grade authentication.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and routing |
| React | Interactive user interface |
| TypeScript | Type-safe application logic |
| Tailwind CSS | Styling and responsive layouts |
| JSON | Local demo data and candidate profiles |
| Custom matching engine | Eligibility checks and compatibility scoring |

## 🧩 How the Matching Engine Works

The matching process follows a structured pipeline:

1. **Load the customer:** Retrieve the customer assigned to the matchmaker.
2. **Filter candidates:** Consider profiles of the opposite gender.
3. **Apply eligibility rules:** Exclude candidates who fail applicable knockout checks.
4. **Evaluate compatibility:** Score relevant dimensions such as age, location, community, education, work, lifestyle, family, language, and values.
5. **Calculate the overall score:** Combine dimension scores using the configured weights.
6. **Categorize results:** Assign an interpretable compatibility band.
7. **Support human review:** Let the matchmaker review the results before initiating a mock introduction.

The matching engine is designed to make its decisions easier to inspect, rather than presenting compatibility as an unexplained number.

## 🖥️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's Next.js requirements.
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/vaishnavimahawar/tdc-matchmaker.git
cd tdc-matchmaker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
```

## 🔑 Demo Login Credentials

Use either of the following demo accounts:

| Matchmaker | Username | Password |
|---|---|---|
| Priya Mehra | `priya` | `match123` |
| Rakesh Bansal | `rakesh` | `match456` |

**Important:** These are demonstration credentials only. Never use hardcoded credentials for a production application.

## 📁 Project Structure

```text
tdc-matchmaker/
├── app/                  # Application pages and API routes
│   ├── api/              # Backend route handlers
│   ├── login/            # Login page
│   └── ...               # Dashboard and related pages
├── components/           # Reusable UI components
├── data/
│   ├── matchmakers.json  # Demo matchmaker accounts
│   ├── profiles.json     # Customer profiles
│   └── pool.json         # Candidate pool
├── lib/
│   ├── data/             # Data access helpers
│   ├── matching/         # Compatibility scoring engine
│   └── auth.ts            # Demo authentication helpers
├── public/                # Static assets
├── package.json           # Dependencies and scripts
└── README.md
```

*The structure above is a high-level guide; individual files may vary as the project evolves.*

## 🎯 Design Principles

- **Human-in-the-loop:** Technology assists matchmakers; it does not make personal decisions on their behalf.
- **Explainability:** Compatibility scores should be understandable and reviewable.
- **Cultural context:** Support biodata dimensions relevant to Indian matchmaking.
- **Privacy awareness:** Personal information should be handled responsibly.
- **Maintainability:** Keep data access, authentication, interface components, and matching logic organized.

## 🔮 Roadmap

Potential next steps for the project include:

- [ ] Persistent customer notes and interaction history
- [ ] Database integration for profiles and matchmaker assignments
- [ ] Secure authentication and role-based authorization
- [ ] AI-assisted profile summaries and natural-language match explanations
- [ ] Improved match feedback and status tracking
- [ ] Automated tests for eligibility rules and scoring
- [ ] Deployment with environment-based configuration
- [ ] Privacy controls and audit logging

## ⚠️ Current Limitations

This project is an MVP intended to demonstrate a matchmaking workflow.

- Demo data is stored locally in JSON files.
- Authentication is for demonstration purposes only.
- The **Send Match** action is a mock workflow, not a real messaging integration.
- Compatibility scores are heuristic outputs and require human interpretation.
- AI capabilities should only be described as implemented when the relevant integration is configured and working.

Do not use this demo with real customer data without appropriate security, privacy, and production-readiness improvements.

## 👩‍💻 Author

**Vaishnavi Mahawar**

GitHub: [@vaishnavimahawar](https://github.com/vaishnavimahawar)

---

<p align="center">
  <strong>Built with care for better matchmaking experiences. 💗</strong>
  <br />
  <sub>TDC Matchmaker — Internship MVP</sub>
</p>
](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
