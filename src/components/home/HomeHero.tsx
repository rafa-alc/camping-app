type HomeHeroProps = {
  hasCurrentTrip: boolean;
  hasSavedTrips: boolean;
  onOpenSavedTrips: () => void;
  onStartPlanning: () => void;
  onResumeTrip: () => void;
};

const featureItems = [
  'Una checklist preparada según cómo viajas y quién viene contigo',
  'Secciones claras, más fáciles de recorrer que una planificación densa',
  'Extras de confort separados para no ensuciar lo esencial',
];

export const HomeHero = ({
  hasCurrentTrip,
  hasSavedTrips,
  onOpenSavedTrips,
  onStartPlanning,
  onResumeTrip,
}: HomeHeroProps) => (
  <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="panel-surface overflow-hidden p-8 sm:p-10">
      <div className="max-w-2xl">
        <span className="ui-chip-soft">Planificador de viajes de camping</span>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-pine-700 sm:text-5xl">
          Planifica y personaliza tu viaje de camping con calma
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-mist-600">
          CampIn convierte el contexto de tu viaje en una checklist guiada, con progreso claro,
          estructura serena y espacio para apartar lo que no hace falta.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="ui-button-primary" onClick={onStartPlanning} type="button">
            Empezar
          </button>
          {hasCurrentTrip && (
            <button
              className="ui-button-secondary px-6 py-3 font-semibold"
              onClick={onResumeTrip}
              type="button"
            >
              Retomar viaje actual
            </button>
          )}
          {hasSavedTrips && (
            <button
              className="ui-button-ghost px-4 py-3 font-semibold"
              onClick={onOpenSavedTrips}
              type="button"
            >
              Viajes guardados
            </button>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="panel-surface p-6">
        <p className="section-title text-sand-500">Por qué se siente diferente</p>
        <ul className="mt-4 space-y-3">
          {featureItems.map((item) => (
            <li className="paper-inset-soft px-4 py-4 text-sm leading-6 text-mist-600" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel-surface p-6">
        <p className="section-title">Qué incluye CampIn</p>
        <p className="mt-3 text-sm leading-6 text-mist-600">
          Inicio, preparación del viaje, checklist principal, extras de confort, elementos
          excluibles y recuperables, viajes guardados y un resumen rápido del viaje.
        </p>
      </div>
    </div>
  </section>
);
