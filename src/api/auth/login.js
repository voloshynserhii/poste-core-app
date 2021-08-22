import { api } from '..';
import { clearAuthData, fakeApiResponse, saveRefreshToken, saveToken, setRefreshTimeout } from './utils';

const ENDPOINT = 'auth/login';
const METHOD = 'login()';

export async function loginByFirebase({ email, password }) {
  try {
    const res = await fetch(process.env.REACT_APP_URL_FIREBASE_LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res?.json();
    log.warn(`${METHOD} -`, data);
    if (res.ok) {
      localStorage.setItem("posteUser", email)
    }
    saveToken(data?.idToken);
    saveRefreshToken(data?.refreshToken);
    setRefreshTimeout(data?.expires);
    log.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');

    return data;
  } catch (error) {
    log.error(`${METHOD} -`, error);
  }
  return undefined;
}

export async function loginByAxios({ email, password }) {
  const payload = {
    email,
    password,
  };
  try {
    clearAuthData();
    const res = process.env.REACT_APP_MULTIPASS ? fakeApiResponse() : await api?.axios?.post(ENDPOINT, payload);
    const { data } = res;
    log.warn(`${METHOD} -`, data);

    saveToken(data?.access_token);
    saveRefreshToken(data?.refresh_token);
    setRefreshTimeout(data?.expires);
    log.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');

    return data;
  } catch (error) {
    log.error(`${METHOD} -`, error);
  }
  return undefined;
}

export default loginByFirebase;
