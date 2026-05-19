# Tarot Project Constitution

## Core Principles

### I. Spec First
Every feature starts with a Spec Kit specification before implementation. Specs must describe user goals, key flows, acceptance criteria, constraints, and measurable success conditions. Implementation details belong in the plan, not the initial spec.

### II. Web UX Is Product Behavior
User-facing behavior includes layout, responsiveness, loading states, empty states, error states, accessibility, and copy. Plans and tasks must treat these as required behavior, not polish to add later.

### III. Type-Safe, Component-Oriented Delivery
Prefer TypeScript for application code and keep UI organized around small, focused components. Shared logic should move into explicit utilities or hooks only when it removes real duplication or clarifies behavior.

### IV. Test the Risk
Each feature plan must identify the highest-risk paths and include appropriate verification. Use unit tests for pure logic, component tests for UI behavior, integration or end-to-end checks for critical user flows, and manual browser verification for visual or responsive changes.

### V. Keep the Surface Small
Choose the simplest stack and architecture that satisfies the current specification. Avoid adding state libraries, UI frameworks, backend services, databases, or build tooling until the spec or plan clearly needs them.

## Web Development Standards

- Accessibility: interactive controls must have visible focus states, semantic labels, keyboard support, and sufficient color contrast.
- Responsiveness: layouts must work on mobile, tablet, and desktop without text overlap or horizontal scrolling.
- Performance: avoid unnecessary client JavaScript, oversized assets, and repeated expensive rendering in core flows.
- Security: never commit secrets; validate user input at boundaries; avoid unsafe HTML injection unless explicitly sanitized.
- Maintainability: prefer existing project patterns once established; keep styling and component APIs consistent.

## Development Workflow

1. Run `$speckit-constitution` only when project principles need to change.
2. Run `$speckit-specify` for each feature and focus on what the user needs.
3. Run `$speckit-clarify` when requirements are ambiguous or risky.
4. Run `$speckit-plan` to choose the web stack, architecture, testing strategy, and rollout path.
5. Run `$speckit-tasks` to create implementation tasks from the approved plan.
6. Run `$speckit-analyze` before implementation when specs, plans, or tasks have changed substantially.
7. Run `$speckit-implement` only after the spec, plan, and tasks are aligned.

## Governance

This constitution guides all specs, plans, tasks, and implementation work in this repository. If a later spec conflicts with these principles, update the constitution first and record the reason in the relevant spec or plan. Changes require a version bump and a dated amendment note.

**Version**: 1.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19
