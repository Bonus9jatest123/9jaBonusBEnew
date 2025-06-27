import cookie from 'js-cookie';

export const setCookie = (key: string, value: string, time: number = 1): void => {
  cookie.set(key, value, { expires: time });
};

export const getCookie = (key: string): string | undefined => {
  const value = cookie.get(key);
  return value;
};

export const removeCookie = (key: string): void => {
  cookie.remove(key);
};
