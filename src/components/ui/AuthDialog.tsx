import { useEffect, useState, type FormEvent } from 'react';

import type { AuthFormInput } from '@/services/auth';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/utils/limits';
import { normalizeTextInput, validatePasswordLength } from '@/utils/validation';

type AuthDialogResult = {
  notice?: string;
  shouldClose?: boolean;
};

type AuthDialogProps = {
  isOpen: boolean;
  isBusy: boolean;
  isConfigured: boolean;
  onClose: () => void;
  onSubmit: (
    mode: 'login' | 'signup',
    input: AuthFormInput,
  ) => Promise<AuthDialogResult | void>;
};

export const AuthDialog = ({
  isOpen,
  isBusy,
  isConfigured,
  onClose,
  onSubmit,
}: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setErrorMessage(null);
      setNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const trimmedEmail = normalizeTextInput(email);
  const passwordError = validatePasswordLength(password);
  const isSubmitDisabled = isBusy || trimmedEmail.length === 0 || passwordError !== null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfigured) {
      return;
    }

    setErrorMessage(null);
    setNotice(null);

    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    try {
      const result = await onSubmit(mode, {
        email: trimmedEmail,
        password,
      });

      if (result?.notice) {
        setNotice(result.notice);
      }

      if (result?.shouldClose) {
        onClose();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo completar la acción.');
    }
  };

  return (
    <div className="ui-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface ui-dialog-panel w-full max-w-md p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="ui-chip-soft">Cuenta</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-pine-700">
              Guarda tus viajes en la nube
            </h2>
            <p className="mt-2 section-helper">
              Inicia sesión o crea una cuenta para conservar tus viajes guardados con Supabase.
            </p>
          </div>
          <button className="ui-button-ghost" onClick={onClose} type="button">
            Cerrar
          </button>
        </div>

        {!isConfigured ? (
          <div className="paper-inset mt-5 p-4 text-sm leading-6 text-mist-600">
            Configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> para
            activar el acceso con cuenta y el guardado en la nube.
          </div>
        ) : (
          <>
            <div className="mt-5 flex gap-2">
              <button
                className={mode === 'login' ? 'ui-button-secondary' : 'ui-button-ghost'}
                onClick={() => setMode('login')}
                type="button"
              >
                Iniciar sesión
              </button>
              <button
                className={mode === 'signup' ? 'ui-button-secondary' : 'ui-button-ghost'}
                onClick={() => setMode('signup')}
                type="button"
              >
                Crear cuenta
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="ui-subtle-heading">Correo electrónico</span>
                <input
                  autoFocus
                  className="ui-input mt-2"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  type="email"
                  value={email}
                />
              </label>

              <label className="block">
                <span className="ui-subtle-heading">Contraseña</span>
                <input
                  className="ui-input mt-2"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={`${PASSWORD_MIN_LENGTH} a ${PASSWORD_MAX_LENGTH} caracteres`}
                  type="password"
                  value={password}
                />
                {passwordError && (
                  <p className="mt-2 text-xs leading-5 text-rose-700">{passwordError}</p>
                )}
              </label>

              {(errorMessage || notice) && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    errorMessage
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-sand-200 bg-sand-50 text-sand-700'
                  }`}
                >
                  {errorMessage ?? notice}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button className="ui-button-ghost" onClick={onClose} type="button">
                  Cancelar
                </button>
                <button
                  className="ui-button-primary disabled:cursor-not-allowed disabled:bg-stone-300"
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  {isBusy
                    ? 'Guardando...'
                    : mode === 'login'
                      ? 'Iniciar sesión'
                      : 'Crear cuenta'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
