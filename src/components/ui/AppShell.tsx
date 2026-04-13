import type { PropsWithChildren } from 'react';

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="relative min-h-screen">
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(125,177,150,0.1),_transparent_55%)]" />
    <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-56 rounded-full bg-[#a2968b]/12 blur-3xl" />

    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <div className="max-w-3xl">
          <span className="ui-subtle-heading text-stone-400">
            CampIn
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
            Calm trip prep for beginner campers
          </h1>
          <p className="mt-1 text-sm text-stone-300">
            A simpler camping checklist that stays readable before the car is even packed.
          </p>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </main>
  </div>
);
