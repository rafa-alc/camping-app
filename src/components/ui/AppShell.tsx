import { useEffect, useMemo, type PropsWithChildren } from 'react';

import {
  appBackgroundPreloadUrls,
  appBackgrounds,
  type AppBackgroundId,
} from '@/app/backgrounds';

type AppShellProps = PropsWithChildren<{
  backgroundId: AppBackgroundId;
  authEmail?: string | null;
  authStatus?: 'loading' | 'anonymous' | 'authenticated';
  isAuthBusy?: boolean;
  onGoHome?: () => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  showHomeAction?: boolean;
  showAuthAction?: boolean;
  supabaseConfigured?: boolean;
}>;

export const AppShell = ({
  children,
  backgroundId,
  authEmail,
  authStatus = 'anonymous',
  isAuthBusy = false,
  onGoHome,
  onOpenAuth,
  onSignOut,
  showHomeAction = false,
  showAuthAction = false,
  supabaseConfigured = false,
}: AppShellProps) => {
  const background = appBackgrounds[backgroundId];
  const authDisplayName = authEmail?.split('@')[0] ?? null;
  const backgroundImageStyle = useMemo(
    () => ({
      backgroundImage: `url(${background.imageUrl})`,
      backgroundPosition: background.position,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      filter: 'saturate(0.98) brightness(0.95) contrast(1.03)',
      transform: 'scale(1.015)',
    }),
    [background.imageUrl, background.position],
  );

  useEffect(() => {
    const preloadedImages = appBackgroundPreloadUrls.map((url) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
      return image;
    });

    return () => {
      preloadedImages.forEach((image) => {
        image.src = '';
      });
    };
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-[#d8d0c7]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 transition-[opacity,transform] duration-500"
          style={backgroundImageStyle}
        />
        <div className="absolute inset-0" style={{ background: background.overlay }} />
        <div className="absolute inset-0" style={{ background: background.accent }} />
        {background.vignette && (
          <div className="absolute inset-0" style={{ background: background.vignette }} />
        )}
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.11),_transparent_58%)]" />
        <div className="absolute inset-y-0 right-0 w-56 rounded-full bg-[#b2a79d]/12 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="relative mb-6 flex flex-col gap-4 sm:min-h-[4.75rem]">
          <div className="max-w-3xl sm:pr-[22rem]">
            <span className="ui-subtle-heading text-stone-500">CampIn</span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
              Preparar una escapada de camping, con tranquilidad y sin dudas
            </h1>
            <p className="mt-1 text-sm text-stone-200">
              Una checklist clara para organizar el viaje antes incluso de empezar a cargar el coche.
            </p>
          </div>

          {(showAuthAction || (showHomeAction && onGoHome)) && (
            <div className="self-start sm:absolute sm:right-0 sm:top-0 sm:self-auto">
              <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-white/18 bg-[linear-gradient(180deg,rgba(37,45,42,0.18)_0%,rgba(24,31,29,0.1)_100%)] px-2 py-2 shadow-[0_12px_24px_-22px_rgba(19,25,23,0.72)] backdrop-blur-sm">
                {showAuthAction && authStatus === 'authenticated' && authDisplayName && (
                  <span className="inline-flex max-w-[8.5rem] items-center rounded-full border border-white/18 bg-white/84 px-2.5 py-1 text-xs font-medium text-pine-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]">
                    <span className="truncate">{authDisplayName}</span>
                  </span>
                )}

                {showAuthAction && authStatus === 'authenticated' && (
                  <button
                    className="ui-button-ghost border border-white/18 bg-white/14 px-3 py-1.5 text-stone-50 hover:bg-white/24 hover:text-white"
                    disabled={isAuthBusy}
                    onClick={onSignOut}
                    type="button"
                  >
                    Cerrar sesión
                  </button>
                )}

                {showAuthAction && authStatus !== 'authenticated' && (
                  <button
                    className="ui-button-ghost border border-white/18 bg-white/14 px-3 py-1.5 text-stone-50 hover:bg-white/24 hover:text-white"
                    disabled={isAuthBusy || authStatus === 'loading'}
                    onClick={onOpenAuth}
                    type="button"
                  >
                    {authStatus === 'loading'
                      ? 'Cargando cuenta...'
                      : supabaseConfigured
                        ? 'Iniciar sesión'
                        : 'Cuenta'}
                  </button>
                )}

                {showHomeAction && onGoHome && (
                  <button
                    className="ui-button-ghost border border-white/18 bg-white/14 px-3 py-1.5 text-stone-50 hover:bg-white/24 hover:text-white"
                    onClick={onGoHome}
                    type="button"
                  >
                    Volver al inicio
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};
