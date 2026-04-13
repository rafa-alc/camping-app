type HomeHeroProps = {
  hasSavedTrip: boolean;
  onStartPlanning: () => void;
  onResumeTrip: () => void;
};

const featureItems = [
  'Trip-ready checklist shaped by how you are staying and who is coming',
  'Clear checklist sections that are easier to scan than a dense planning layout',
  'Optional comfort extras kept separate from the core packing flow',
];

export const HomeHero = ({
  hasSavedTrip,
  onStartPlanning,
  onResumeTrip,
}: HomeHeroProps) => (
  <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="panel-surface overflow-hidden p-8 sm:p-10">
      <div className="max-w-2xl">
        <span className="ui-chip-soft">Camping trip planner</span>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-pine-700 sm:text-5xl">
          Prepare a camping trip without second-guessing every item.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-mist-600">
          CampIn turns your trip context into a guided checklist with clear progress,
          calm structure, and room to leave the irrelevant items behind.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="ui-button-primary"
            onClick={onStartPlanning}
            type="button"
          >
            Start planning
          </button>
          {hasSavedTrip && (
            <button
              className="ui-button-secondary px-6 py-3 font-semibold"
              onClick={onResumeTrip}
              type="button"
            >
              Resume current trip
            </button>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="panel-surface p-6">
        <p className="ui-subtle-heading text-sand-500">Why it feels different</p>
        <ul className="mt-4 space-y-3">
          {featureItems.map((item) => (
            <li
              className="rounded-2xl border border-stone-100 bg-stone-50/90 px-4 py-4 text-sm leading-6 text-mist-600"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel-surface p-6">
        <p className="section-title">What this MVP covers</p>
        <p className="mt-3 text-sm leading-6 text-mist-600">
          Home, setup, trip checklist, comfort extras, recoverable not-needed items, local
          persistence and a lightweight summary modal.
        </p>
      </div>
    </div>
  </section>
);
