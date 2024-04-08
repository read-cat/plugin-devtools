import { isError, isNull, isString } from '../is';

export const debounce = (fn: (...args: any[]) => void, ms = 1000) => {
  let timeout: number | null = null;

  return (...args: any[]) => {
    if (!isNull(timeout)) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, ms);
  }
}

export const getErrorMessage = (error: any) => {
  if (isError(error)) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return String(error);
}