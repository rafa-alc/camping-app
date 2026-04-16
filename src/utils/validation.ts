import {
  CUSTOM_ITEM_MAX_COUNT,
  CUSTOM_ITEM_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TRIP_NAME_MAX_LENGTH,
} from '@/utils/limits';

export const normalizeTextInput = (value: string | null | undefined): string =>
  typeof value === 'string' ? value.trim() : '';

export const validatePasswordLength = (value: string): string | null => {
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`;
  }

  return null;
};

export const validateTripName = (value: string): string | null => {
  const normalizedValue = normalizeTextInput(value);

  if (normalizedValue.length === 0) {
    return null;
  }

  if (normalizedValue.length > TRIP_NAME_MAX_LENGTH) {
    return `Máximo ${TRIP_NAME_MAX_LENGTH} caracteres.`;
  }

  return null;
};

export const validateCustomItemName = (value: string): string | null => {
  const normalizedValue = normalizeTextInput(value);

  if (normalizedValue.length === 0) {
    return 'Escribe un nombre.';
  }

  if (normalizedValue.length > CUSTOM_ITEM_NAME_MAX_LENGTH) {
    return `Máximo ${CUSTOM_ITEM_NAME_MAX_LENGTH} caracteres.`;
  }

  return null;
};

export const validateCustomItemCount = (count: number): string | null => {
  if (count >= CUSTOM_ITEM_MAX_COUNT) {
    return `Has alcanzado el máximo de ${CUSTOM_ITEM_MAX_COUNT} elementos personalizados para este viaje.`;
  }

  return null;
};
