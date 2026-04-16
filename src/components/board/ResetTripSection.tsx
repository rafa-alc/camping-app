type ResetTripSectionProps = {
  onResetTrip: () => void;
};

export const ResetTripSection = ({ onResetTrip }: ResetTripSectionProps) => (
  <section className="rounded-3xl border border-rose-200/70 bg-rose-50/70 p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="section-title text-rose-700">Reiniciar viaje</h2>
        <p className="mt-1 text-sm leading-6 text-rose-700/80">
          Borra el contexto y el progreso del viaje actual en esta checklist.
        </p>
      </div>

      <button
        className="ui-button-danger"
        onClick={onResetTrip}
        type="button"
      >
        Reiniciar viaje actual
      </button>
    </div>
  </section>
);
