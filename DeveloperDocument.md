# Partner & Pump Guidelines

---

## 📘 User Manual

#### Prerequisites
| Tool | Version | Purpose |
|------|----------|----------|
| Node.js | ≥ 18.x | JavaScript runtime |
| npm | ≥ 9.x | Package manager |
| Expo CLI | 6.x | Run React Native apps |

#### How to obtain the source code:
  1. Clone the repository
      Anyone can access the source code by cloning this public GitHub repository:
      git clone https://github.com/PartnerAndPump/partner-and-pump.git
  2. Navigate into the project directory
      cd partner-and-pump

#### Directory Structure
Partner-And-Pump/
├─ app/                        # React Native client (Expo)
│  ├─ components/              # Reusable UI components (buttons, cards, etc.)
│  ├─ screens/                 # App screens (PumpNow, Profile, MatchResults)
│  ├─ navigation/              # Navigation setup using React Navigation
│  ├─ services/                # Business logic (matching, validation, Firebase)
│  ├─ state/                   # Context API hooks (Auth, Session, etc.)
│  ├─ utils/                   # Helper functions (time/date, etc.)
│  ├─ __tests__/               # Frontend Jest test files
│  ├─ index.js                 # App entry point that initializes the root component
│  ├─ jest.config.js           # Jest configuration for app-side testing
│  ├─ app.json                 # Expo app configuration
│  └─ package.json             # Client dependencies and scripts
│
├─ functions/                  # Firebase Cloud Functions (backend)
│  ├─ src/
│  │   ├─ index.ts             # Entry point for backend functions
│  │   ├─ match/               # Partner matching logic
│  │   ├─ validation/          # Input/data validation
│  │   └─ messaging/           # Notifications (push/chat)
│  ├─ __tests__/               # Backend unit tests
│  ├─ tsconfig.json
│  └─ package.json
│
├─ User Manual                 # User guide to Partner & Pump usage
│  
├─ Developer Document          # Developer guide for contributing to Partner & Pump 
│
├─ .github/workflows/          # GitHub Actions CI/CD workflows
│  ├─ ci-js.yml                # Jest test workflow for app + backend
│  
│
├─ node_modules/               # Installed npm dependencies (auto-generated)
│
├─ reports/                    # Temporary folder for output, testing, and logs
│
├─ .gitignore                   # Files and directories ignored by Git
│
├─ coding-guidelines.md        # Contributor code conventions and best practices
│
├─ babel.config.js             # Babel setup for transpiling modern JS
│
├─ package.json                # Root project configuration (scripts, dependencies)
│
├─ package-lock.json           # Locked dependency versions for consistent installs
│
├─ tsconfig.json                # TypeScript configuration (for backend)
├─ README.md                   # General overview of the project
└─ LICENSE                     # Open source license

#### How to build software: 
This project has two build targets:

Mobile client (Expo React Native) — lives in the app/ folder (started from the repo root).

Backend (Firebase Cloud Functions, TypeScript) — lives in functions/.

Follow the steps below to build all components locally and verify everything with tests.

# Install once
npm i -g firebase-tools   # deploy/emulate backend
# Expo CLI is invoked via npx, no global install required

1) Clone & install
git clone https://github.com/AmmaarSiddiqui/Partner-And-Pump.git
cd Partner-And-Pump

# Install root dependencies (Expo app and tooling)
npm ci

# Install backend deps
cd functions
npm ci
cd ..

2) Build & run the mobile client (Expo)
Fast dev via Expo Go (no native build)
# From repo root
# Clear cache on first run while we’re evolving dependencies
npx expo start -c


Scan the QR with Expo Go (iOS/Android) to launch the app.

Make sure your phone and computer are on the same network.

This will prebuild native projects and open the iOS Simulator.


3) Build & run the backend (Cloud Functions)

TypeScript → JavaScript build:

cd functions
npm run build    # transpiles to lib/

4) Lint & type-check (optional but recommended)
# Frontend (if ESLint config is present)
npm run lint

# Backend TS type-check
cd functions
npm run typecheck     # or: npx tsc --noEmit
cd ..


#### How to run tests: 
Testing ensures that both the **mobile client (Expo app)** and **Firebase backend** perform correctly and remain stable as new features are introduced.
Partner & Pump uses **Jest** for automated testing. 
Continuous Integration (CI) is configured through GitHub Actions to automatically run all tests on every push or pull request.

---



Jest is used for all test files both frontend and backend which are named __tests__/`.

Backend and Frontend Tests (Firebase Functions)
1. Navigate to the backend directory:
cd functions
npm install
Run all Jest tests:
npm test


_____
#### How to Add a New Test
Add or update the code you want to test under functions/src/.... For example, if you create a new helper called formatInviteMessage in functions/src/invites/formatInviteMessage.ts, that’s the code you’ll be testing.

Create a new test file in functions/__tests__/ with a matching purpose and a .test.ts suffix. For example: functions/__tests__/formatInviteMessage.test.ts.

In that test file, import the function(s) you want to verify from functions/src/....

Write Jest tests using describe(...), it(...), and expect(...).

   
Include at least one “happy path” test (valid input returns the correct result).
Include at least one defensive/edge case test (bad/missing input is handled safely or rejected).
If the code has side effects (like recording a notification), assert on those effects.

From inside the functions/ directory, run:

   
   npm install   # only needed the first time on a new machine
   npm test      # runs all Jest tests locally
   


   Make sure your new test passes locally.

Commit both:

   
the source file you added or modified in functions/src/..., and
the new test file in functions/__tests__/.

Push your changes or open a pull request to main or develop. GitHub Actions (from .github/workflows/ci-js.yml) will automatically cd into functions/, run npm install, and execute all .test.ts files in functions/__tests__/. If your new test fails in CI, the PR/build will be marked as failed and can’t be merged until it’s fixed.

Keep tests independent — try not to rely on results from other tests.

Name tests after the feature or function (e.g., ProfileValidation.test.ts).

Use mocks for Firebase calls only when integration tests aren’t needed.

Commit your test with the corresponding feature update.
Keep all tests in __test__

_____
#### How to build a new release

Releasing Partner & Pump involves packaging both the Expo mobile client and Firebase backend into stable, versioned builds suitable for testing or publication to app stores.
Most of the process is automated through Expo’s build service and Firebase’s CLI tools, but several manual checks are still required.
Before starting a release, ensure that your local branch is up to date with the latest version of main. Each release should include a new version number in both the root package.json and app.json files. 

Once the version numbers have been updated, commit and push your changes. The Expo CLI handles the client build process. To create a release build, run the following command from the project root:





After deployment, test key endpoints (authentication, match creation, and profile updates) using EXPO to ensure stability.

Although most build and deployment steps are automated, developers should still perform manual quality assurance. This includes verifying that assets load correctly, API keys and environment variables are valid, and that version numbers in the documentation match the current release. 
The final check involves running through the app’s onboarding and matching flow to confirm there are no regressions before tagging the release.

When you are done with all the manual tests, add a tag to name the release:

git tag -a v1.0.0 -m "Partner & Pump v1.0.0 stable release"
git push origin v1.0.0









