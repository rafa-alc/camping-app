# CampIn

CampIn is a camping trip preparation web app for beginner campers who want a calmer, more reliable way to get ready for a trip without forgetting the basics.

It turns a few trip details into a guided checklist with clear category grouping, live progress, optional comfort extras, and a recoverable "not needed" flow for irrelevant suggestions.

## Who it is for

- Beginner campers who want confidence before leaving
- Casual campers who prefer a simple checklist over a dense planning tool
- Solo planners who want a believable MVP product, not a generic to-do list

## What problem it solves

Camping prep can feel uncertain, especially for less experienced users. CampIn reduces that uncertainty by:

- generating a checklist from trip context
- grouping preparation into clear categories
- separating optional extras from core readiness
- keeping progress visible while the checklist stays simple to act on
- allowing irrelevant suggestions to be excluded without deleting them

## Current V1.5 scope

- Home / landing screen
- Compact trip setup flow
- Main trip checklist in a vertical category flow
- Sticky progress overview on desktop
- Comfort extras section
- Unified "Not needed" management and restore flow
- Summary modal
- Local persistence with Zustand and `localStorage`

## UX simplification reset

V1.5 includes a deliberate UX simplification reset based on feedback.

The product moved away from a denser board-style presentation and toward a more familiar checklist experience. The goal was to reduce cognitive load, improve first-glance clarity, and make the product feel calmer and easier to complete for regular users.

That shift included:

- a single vertical checklist flow
- checkbox-first task interaction
- removal of the old `in_progress` task state
- a secondary progress sidebar on desktop instead of progress dominating the main flow
- a more compact trip setup selector

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- `localStorage`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Run lint:

```bash
npm run lint
```

4. Build for production:

```bash
npm run build
```

## Project structure

```text
src/
  app/         App composition and top-level flow
  catalog/     Mock task catalog
  components/  UI components by area
  logic/       Pure derived helpers
  rules/       Contextual checklist rules
  store/       Zustand store and persistence
  types/       Domain model types
  utils/       Labels, formatting, ids, UI helpers
```

## Intentionally out of scope

- Backend or auth
- Public profiles or social features
- AI features
- Maps, weather, or external integrations
- Manual task editing
- Advanced scoring systems
- Multi-user collaboration

## Future direction

Short-term iteration can continue improving polish, accessibility, and catalog quality while keeping the current checklist-first foundation intact.

Longer-term versions can explore richer trip context, smarter generation, and more contextual visual direction once the MVP interaction model is stable.
