# CampIn — Project instructions

## Project overview

This repository contains the MVP V1 of a camping trip preparation web app.

The project is being developed by a solo developer.
Do not assume a team workflow, enterprise complexity, backend infrastructure, or multi-user collaboration.

This is a serious product-oriented project, not a throwaway demo.

The goal of V1 is to deliver a clean, believable, reviewable MVP foundation that can later evolve into a more complete product.

## Product purpose

This app helps users prepare a camping trip through a visual, structured, and personalized checklist.

It is not a generic to-do app with a camping theme.

The product value comes from combining:
- contextual checklist generation
- visual organization by category
- progress tracking
- light gamification
- reversible exclusion of irrelevant suggested items

The main target user is a beginner camper who wants to reduce uncertainty and avoid forgetting important things.

## MVP V1 scope

The MVP must include:
- Home / landing view
- Trip setup view
- Main trip board view
- Lightweight summary modal inside the board
- Mock contextual checklist generation
- Task states: todo, in_progress, done, not_needed
- Progress calculation based only on active tasks
- Comfort extras separated from the core checklist
- Pocket points as a light gamification layer
- Zustand for state management
- Local persistence with localStorage
- Responsive UI

Out of scope for V1:
- authentication
- backend
- user accounts
- public profiles
- social/community features
- messaging
- AI features
- weather integrations
- maps
- external APIs
- manual task editing
- advanced scoring economy
- multi-user collaboration
- backend or auth placeholders

AI is intentionally out of scope for V1, but the architecture should remain modular enough to support future AI-related features later without breaking the product structure.

## Tech stack

Use:
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- localStorage

Prefer simple, readable, maintainable solutions.

## Core product decisions

### Trip context fields
Use these exact setup fields:
- peopleCount: '1' | '2' | '3' | '4_plus'
- tripDuration: 'short' | 'medium' | 'long'
- accommodationType: 'tent' | 'caravan' | 'bungalow' | 'camping_cabin'
- hasPet: boolean
- hasChildren: boolean

### Main visual unit
The main visual unit is the category, not the individual task.

Each category must show a derived visual status:
- todo
- in_progress
- done

Overall progress must still recognize partial internal progress from tasks inside categories.

### Task states
Tasks must support:
- todo
- in_progress
- done
- not_needed

### not_needed behavior
This behavior is critical.

A task marked as not_needed:
- is not deleted
- is excluded from active progress
- is excluded from points
- is excluded retroactively even if it was previously done
- must remain recoverable later from a separate “Not needed” section

### Progress behavior
Progress is based on active tasks only.

Definition:
- activeTasks = all tasks except those with status = not_needed

The app must show:
- Trip readiness = progress of essential active tasks
- Comfort extras = progress of extra active tasks
- Pocket points = total current points

### Points behavior
For V1 use a simple mock scoring system:
- essential done task = 10 points
- extra done task = 5 points
- any other status = 0 points
- not_needed = 0 points

Points must be recalculated from current task states.
Do not rely on fragile manual accumulation.

### Context editing
The main board must include:
- Reset trip
- Edit context

Editing context must regenerate the checklist in V1.
Do not try to preserve advanced prior state across context changes.

## UX requirements

The app should feel:
- clear
- visual
- calm
- guided
- satisfying

It should not feel like:
- a spreadsheet
- a generic kanban
- a childish game
- a noisy dashboard

### Required views
1. Home / landing
2. Trip setup
3. Trip board
4. Summary modal inside the board

### Progress labels
Use these exact labels:
- Trip readiness
- Comfort extras
- Pocket points

### Extras behavior
Comfort extras must be visually separated from the core preparation checklist.

### not_needed interaction
Do not make not_needed the main click/tap interaction for tasks.
Task interaction should primarily focus on status/progress updates.
not_needed should be handled through a secondary action flow.

## Domain model expectations

Keep a clean separation between:
- TaskTemplate = base catalog item
- TripTask = generated task instance for the current trip

Use this structure and intent:

- PeopleCount
- TripDuration
- AccommodationType
- TaskCategory
- TaskPriority
- TaskType
- TaskStatus
- TripContext
- TaskTemplate
- TripTask
- TripState

You may refine exact types slightly if needed, but preserve the same structure and intent.

## Architecture requirements

Use a structure close to:

src/
  app/
  components/
    ui/
    home/
    setup/
    board/
  catalog/
  rules/
  logic/
  store/
  types/
  utils/

### Separation of concerns
- catalog = mock task templates
- rules = contextual generation rules
- logic = pure functions for generation and derived calculations
- store = Zustand state + persistence
- components = UI only

Do not place core business logic directly inside large UI components.

### Derived data
Prefer deriving:
- progress
- category status
- visible categories
- points
- not_needed lists

Do not store duplicated derived state unless clearly necessary.

## Mock catalog and rules

Use a mock but believable catalog for V1.

Categories:
- essentials
- sleep
- shelter
- cooking
- food
- clothing
- hygiene
- safety
- pet
- children
- comfort_extras

Example tasks must cover:
- reservation_docs, phone, charger, wallet_keys, water
- sleeping_bag, pillow, sleeping_pad, blanket
- tent, stakes, tarp
- stove, fuel, cookware
- planned_food, snacks, cooler
- change_clothes, warm_clothes, rain_jacket
- toothbrush, towel, toilet_paper, sunscreen
- flashlight, first_aid, power_bank
- pet_food, pet_bowl, pet_bed, pet_leash
- kids_extra_clothes, kids_hygiene, kids_comfort_item, kids_entertainment
- camp_chair, ambient_light, speaker, special_breakfast

A generated trip should usually end up with around 18 to 24 active tasks depending on context.

### Base generation rules
- Base categories generally present: essentials, sleep, food, clothing, hygiene, safety, comfort_extras
- tent includes shelter and fuller sleep/cooking relevance
- caravan hides shelter and may omit sleeping_pad
- bungalow hides shelter and reduces sleep/cooking weight
- camping_cabin hides shelter and reduces sleep further
- hasPet includes pet category
- hasChildren includes children category
- medium and long duration raise relevance for selected tasks
- 4_plus raises relevance for water, planned_food, cookware, change_clothes
- visible categories should only render when they have relevant active tasks
- if a task becomes not_needed, it must still remain recoverable

## Implementation rules

When making changes:
- favor readability over cleverness
- favor modularity over premature abstraction
- favor deterministic logic over magic
- keep business rules easy to inspect and modify
- do not invent extra features
- do not add backend/auth placeholders
- do not overengineer for future scale
- keep the UI believable as a real MVP product

## Validation expectations

Before considering a task complete:
- run the available build/type/lint checks if they exist
- fix obvious TypeScript issues
- ensure the app still respects the MVP scope
- avoid introducing unused abstractions or dead code

If a command is unavailable, state that clearly instead of pretending it was run.

## Response format for coding tasks

After completing a task, always provide:
1. What you changed
2. Files created or modified
3. Main technical decisions
4. Any simplifications made
5. Anything still rough or ready for iteration
6. What should be reviewed manually