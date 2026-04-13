# Changelog

## Unreleased

- No unreleased entries yet.

## V1.5 - UX simplification and polish

- Moved the main trip experience from a denser board-style composition to a simpler vertical checklist flow.
- Removed `in_progress` from the product model and user-facing interaction.
- Introduced checkbox-first task completion for checklist rows.
- Simplified task rows to a lighter icon + label + checkbox structure by default.
- Moved the progress overview into a desktop sidebar and kept a compact top block on narrow layouts.
- Redesigned the trip setup into a more compact selector-style pattern.
- Refined the visual language to feel calmer, lighter, and more consistent.
- Kept comfort extras and the unified `Not needed` flow as secondary sections.
- Removed the children category from the product to keep the MVP narrower and easier to maintain.
- Fixed the desktop sticky progress sidebar behavior.
- Added final consistency polish across rows, headers, buttons, chips, and support sections.

## V1 - Initial MVP foundation

- Added the home screen, trip setup flow, main trip experience, and summary modal.
- Implemented contextual checklist generation from trip inputs.
- Added category-based grouping for preparation tasks.
- Added progress tracking for core readiness, comfort extras, and pocket points.
- Added recoverable `not_needed` behavior for irrelevant suggestions.
- Added local persistence with Zustand and `localStorage`.
- Established the initial modular architecture across catalog, rules, logic, store, components, types, and utils.
