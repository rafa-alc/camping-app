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
  const headerActionGroupClass =
    'flex w-fit flex-wrap items-center gap-1.5 rounded-full border border-white/28 bg-[linear-gradient(180deg,rgba(48,57,54,0.14)_0%,rgba(28,35,33,0.08)_100%)] px-1.5 py-1.5 shadow-[0_14px_28px_-24px_rgba(19,25,23,0.72)] backdrop-blur-md sm:flex-nowrap';
  const headerActionButtonClass =
    'rounded-full border px-3.5 py-1.5 text-sm font-semibold text-pine-800 transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out border-[rgba(219,207,188,0.94)] bg-[linear-gradient(180deg,rgba(250,245,238,0.96)_0%,rgba(244,236,226,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_10px_18px_-18px_rgba(83,64,46,0.55)] hover:-translate-y-px hover:border-[rgba(205,191,172,0.96)] hover:bg-[linear-gradient(180deg,rgba(252,248,242,1)_0%,rgba(247,239,229,1)_100%)] hover:text-pine-900';
  const headerActionGhostClass =
    'rounded-full border px-3.5 py-1.5 text-sm font-medium text-pine-700 transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out border-[rgba(230,221,207,0.72)] bg-[linear-gradient(180deg,rgba(248,242,234,0.74)_0%,rgba(241,233,223,0.76)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.44),0_8px_16px_-18px_rgba(83,64,46,0.42)] hover:-translate-y-px hover:border-[rgba(217,206,190,0.92)] hover:bg-[linear-gradient(180deg,rgba(250,246,240,0.92)_0%,rgba(244,237,227,0.94)_100%)] hover:text-pine-800';
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
              <div className={headerActionGroupClass}>
                {showAuthAction && authStatus === 'authenticated' && authDisplayName && (
                  <span className="inline-flex max-w-[7.75rem] items-center rounded-full border border-white/28 bg-white/90 px-2.5 py-1 text-xs font-medium text-pine-700 shadow-[0_8px_16px_-18px_rgba(53,41,29,0.45),inset_0_1px_0_rgba(255,255,255,0.42)]">
                    <span className="truncate">{authDisplayName}</span>
                  </span>
                )}

                {showAuthAction && authStatus === 'authenticated' && (
                  <button
                    className={headerActionButtonClass}
                    disabled={isAuthBusy}
                    onClick={onSignOut}
                    type="button"
                  >
                    Cerrar sesión
                  </button>
                )}

                {showAuthAction && authStatus !== 'authenticated' && (
                  <button
                    className={headerActionButtonClass}
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
                    className={headerActionGhostClass}
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
