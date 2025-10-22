# Coding Guidelines

## JavaScript (React Native Client)

**Guideline:**  
[Airbnb JavaScript Style Guide (with React additions)](https://github.com/airbnb/javascript)

**Why we chose it:**  
This is one of the most popular and comprehensive JavaScript style guides available. Because our client is built in React Native, the guide's specific rules for React (which are included) are directly applicable and enforce modern best practices, readability, and consistency, which is crucial for a team project.

**How we'll enforce it:**  
We will enforce this guide automatically using ESLint configured with the `eslint-config-airbnb` package. We will also use Prettier for consistent code formatting. These tools will be run as a pre-commit hook (using Husky) to ensure no non-compliant code is committed to the repository.

---

## TypeScript (Cloud Functions Backend)

**Guideline:**  
[Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

**Why we chose it:**  
Given that our entire backend is built on Google's Firebase platform, it is logical to adopt Google's official style guide for TypeScript. This guide is thorough, opinionated, and designed for creating scalable and maintainable code, which is essential for our serverless backend logic (Cloud Functions).

**How we'll enforce it:**  
We will use ESLint with the `@typescript-eslint/parser` and `eslint-config-google` plugins, configured to follow this guide. This linting step will be integrated into our development environment and also run as part of a CI (Continuous Integration) check on all pull requests to prevent merging code that violates the style rules.

---

## React (React Native Components)

**Guideline:**  
[React Official Documentation (Main Concepts & Hooks)](https://react.dev/learn)

**Why we chose it:**  
This guide represents the React team's official recommendations. Following these idiomatic patterns (like component composition, prop-driven design, and hooks-based state management) is the best way to ensure our React Native UI code is maintainable, modular, and testable.

**How we'll enforce it:**  
We will use the ESLint plugin `eslint-plugin-react` to automatically enforce React-specific rules, including hook rules and naming conventions (PascalCase for components, camelCase for hooks). Manual code reviews will be used to verify adherence to functional programming patterns (e.g., avoiding unnecessary class components) and proper composition. We will also use the React Testing Library to ensure component behavior aligns with these patterns.
