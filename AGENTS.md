# CampIn — Project instructions

## Project overview

This repository contains **CampIn**, a camping trip preparation web app being developed by a solo developer.

Do not assume:
- a team workflow
- enterprise complexity
- multi-user collaboration
- broad backend infrastructure beyond what already exists
- feature scope that has not been explicitly approved

This is a serious product-oriented project, not a throwaway demo.

The product has already moved beyond the original MVP foundation and now includes a **functional V2-oriented architecture** with:
- contextual checklist generation
- normalized catalog structure
- custom trip items
- saved trips
- authentication
- hybrid local/cloud persistence
- light gamification
- contextual background imagery
- a calmer, checklist-first UX

## Product purpose

CampIn helps users prepare a camping trip through a visual, structured, and personalized checklist.

It is **not** a generic to-do app with a camping theme.

The value of the product comes from combining:
- contextual checklist generation
- simplified checklist-first UX
- progress tracking
- custom user flexibility
- saved trip continuity
- reversible exclusion of irrelevant suggested items
- light gamification that reinforces progress without dominating the experience

The main target user is still a beginner camper who wants to reduce uncertainty and avoid forgetting important things, though the app should remain useful to more experienced users too.

---

## Current product direction

CampIn should feel like:
- clear
- calm
- visual
- guided
- satisfying
- useful first

It should **not** feel like:
- a spreadsheet
- a dense dashboard
- a generic kanban
- a childish game
- a social product
- a “system UI” with too much visible complexity

The checklist remains the core of the product.

---

## Current active scope

The app currently includes or may actively evolve within these areas:

- Home / planning state
- Trip setup
- Current trip checklist
- Summary modal
- Saved trips flow
- Auth flow
- Cloud persistence
- Normalized catalog-based checklist generation
- Custom items per trip
- Light gamification / total points / achievement showcase
- Contextual background imagery
- Local + cloud hybrid persistence

Out of scope unless explicitly requested:
- social/community features
- sharing/public profiles
- messaging
- AI assistant/chat as a core feature
- maps
- weather integrations
- marketplace/economy systems
- broad profile systems
- achievement spending systems
- levels/streaks/leaderboards
- enterprise architecture
- speculative future systems

---

## Tech stack

Use:
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- localStorage
- Supabase

Prefer:
- simple solutions
- readable code
- modular logic
- maintainable structure

Do not overengineer.

---

## Core product decisions

### Trip context fields
Use these exact setup fields:

- peopleCount: '1' | '2' | '3' | '4_plus'
- tripDuration: 'short' | 'medium' | 'long'
- accommodationType: 'tent' | 'caravan' | 'bungalow' | 'camping_cabin'
- hasPet: boolean

`children` has been removed from the product.
Do not reintroduce it unless explicitly requested.

### Current trip naming
A trip may have:
- an optional custom user-facing name
- a fallback generated title when no custom name exists

Keep fallback naming logic intact.

### Main visual unit
The category remains the main semantic and visual unit of the checklist.

Tasks should feel lightweight inside categories.
Do not drift back toward a dense taskboard feel.

### Task states
Tasks must support:
- todo
- done
- not_needed

`in_progress` is not part of the current product and must not be reintroduced.

### not_needed behavior
This behavior is critical.

A task marked as `not_needed`:
- is not deleted
- is excluded from active progress
- is excluded from points
- is excluded retroactively even if it was previously done
- remains recoverable from a separate `Not needed` section

Do not make `not_needed` the primary task interaction.

### Progress behavior
Progress is based on active tasks only.

Definition:
- activeTasks = all tasks except those with status = not_needed

The app must show:
- Trip readiness = progress of essential active tasks
- Comfort extras = progress of extra active tasks
- Pocket points = current trip points
- Total points = accumulated user-level progress for achievements

### Points behavior
Current trip points:
- essential done task = 10 points
- extra done task = 5 points
- todo = 0
- not_needed = 0

Points must be recalculated from task state.
Do not rely on fragile manual accumulation.

### Total points behavior
Total points are a separate meta-progress layer.

Rules:
- each eligible trip can grant exactly 250 total points
- only once per trip
- only when that trip first reaches 250 or more trip points
- duplicated trips must not be usable to farm total points
- total points never decrease after being granted
- internal max total points = 10000
- display cap = `9999+`

### Achievements
Achievements are unlocked from total points thresholds.

Keep them:
- visually present
- lightweight
- secondary
- not game-heavy

Locked achievements should remain visible in a blocked/disabled state.

---

## UX requirements

The app should maintain a **checklist-first** experience.

### Required major views / states
- Home / landing / planning state
- Trip setup
- Current trip
- Summary modal
- Saved trips
- Auth UI
- Achievement showcase (secondary UI)

### Progress labels
Use these exact labels:
- Trip readiness
- Comfort extras
- Pocket points
- Total points

### Extras behavior
Comfort extras must remain visually separated from the core preparation checklist.

### Checklist behavior
The checklist should remain:
- vertical
- simple
- readable
- familiar

Do not drift back toward:
- multi-board layouts
- status-heavy task controls
- overly dense task cards

### Custom item behavior
Custom items:
- belong to the current trip
- integrate into the same checklist system
- can be added to normal categories or Comfort extras
- follow the same state model
- affect progress and points like normal tasks

Do not turn custom items into a separate subsystem.

### Saved trips behavior
Saved trips must support:
- save
- open
- duplicate
- use as template
- rename
- delete

Duplicate and template behavior must remain conceptually distinct.

### Auth behavior
Authentication is now part of the product.

Requirements:
- email/password auth
- persistent session
- logout
- authenticated cloud persistence

Do not build a broad account/profile/settings system unless explicitly requested.

### Persistence model
The current product uses hybrid persistence:

- anonymous user → local persistence
- authenticated user → cloud persistence via Supabase

Do not remove anonymous/local usability unless explicitly requested.

---

## Domain model expectations

Keep a clean separation between:
- CatalogCategory
- CatalogPool
- CatalogItem
- generated checklist task
- current trip state
- saved trip record
- user progress / total points state

Suggested domain concepts include:
- PeopleCount
- TripDuration
- AccommodationType
- TaskCategory
- TaskPriority
- TaskType
- TaskStatus
- TripContext
- CatalogCategory
- CatalogPool
- CatalogItem
- TripTask
- SavedTripRecord
- UserProgress / totalPoints
- reward metadata per trip

You may refine exact types if needed, but preserve the overall shape and intent.

---

## Catalog architecture

The checklist generation now uses a normalized catalog structure with 3 layers:

1. categories
2. pools
3. items

Important rule:
- visible checklist tasks are generated from **pools**, not raw items

This is intentional and should not be undone casually.

### Current category set
- shelter_rest
- cooking_food
- clothing_footwear
- energy_lighting_navigation
- health_safety_repair
- hygiene_cleanup
- documents_money
- leisure
- pet

Do not reintroduce `children`.

### Conditions
Supported contextual conditions may include:
- accommodationIn
- tripDurationIn
- peopleCountIn
- requiresPet

Keep condition logic deterministic and easy to inspect.

---

## Architecture requirements

Use a structure close to:

src/
  app/
  components/
    ui/
    home/
    setup/
    board/
    auth/
    saved-trips/
    achievements/
  catalog/
  logic/
  services/
  store/
  types/
  utils/
  lib/

### Separation of concerns
- catalog = structured source data
- logic = pure generation and derived behavior
- services = Supabase/auth/cloud persistence access
- store = Zustand state + local persistence + app orchestration
- components = UI only
- utils = formatting, limits, validation, helpers

Do not place core business rules inside large UI components.

### Derived data
Prefer deriving:
- progress
- visible categories
- points
- total points display
- achievement unlock state
- not_needed lists

Do not store duplicated derived state unless clearly justified.

---

## Background / visual implementation

The app now uses contextual background imagery by view/state.

Treat background images as:
- atmospheric layers
- secondary visual support
- never the primary content

They must not reduce readability.

Do not redesign the app into a hero-image-first product.
The checklist and UI remain primary.

---

## Implementation rules

When making changes:
- favor readability over cleverness
- favor modularity over premature abstraction
- favor deterministic logic over magic
- keep business rules easy to inspect and modify
- avoid speculative future systems
- do not invent product scope
- do not add social/profile/public features unless explicitly requested
- do not reintroduce removed concepts like `children` or `in_progress`
- preserve the current calm, product-like, checklist-first UX

---

## Validation expectations

Before considering a task complete:
- run available build/type/lint checks if they exist
- fix obvious TypeScript issues
- avoid introducing dead code or unused abstractions
- ensure the app still works for:
  - anonymous users
  - authenticated users
  - local persistence flows
  - cloud persistence flows

If a command is unavailable, state that clearly instead of pretending it was run.

When a feature touches persistence or auth, always check both:
- local anonymous behavior
- authenticated cloud behavior

---

## Response format for coding tasks

After completing a task, always provide:
1. What you changed
2. Files created or modified
3. Main technical decisions
4. Any simplifications made
5. Anything still rough or ready for iteration
6. What should be reviewed manually

---

## Practical constraints

This project is developed by one person.
Optimize for:
- momentum
- clarity
- reviewability
- realistic product progress

Do not assume a team will later “clean it up.”
Prefer small, solid, explainable solutions.