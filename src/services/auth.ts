import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthFormInput = {
  email: string;
  password: string;
};

export type SignUpResult = {
  needsEmailConfirmation: boolean;
};

const mapSessionUser = (session: Session | null): AuthUser | null => {
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
  };
};

export const getCurrentAuthUser = async (): Promise<AuthUser | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  const client = getSupabaseClient();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return mapSessionUser(data.session);
};

export const subscribeToAuthChanges = (callback: (user: AuthUser | null) => void) => {
  if (!isSupabaseConfigured) {
    return () => undefined;
  }

  const client = getSupabaseClient();
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => {
      callback(mapSessionUser(session));
    }, 0);
  });

  return () => {
    subscription.unsubscribe();
  };
};

export const signUpWithEmail = async ({
  email,
  password,
}: AuthFormInput): Promise<SignUpResult> => {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    needsEmailConfirmation: !data.session,
  };
};

export const signInWithEmail = async ({ email, password }: AuthFormInput) => {
  const client = getSupabaseClient();
  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
};

export const signOutFromSupabase = async () => {
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut({ scope: 'local' });

  if (error) {
    throw error;
  }
};
