import { api } from '..';

const ENDPOINT = 'auth/recovery';
const METHOD = 'recovery()';

export async function recoveryByAxios({ email }) {
  if (process.env.REACT_APP_MULTIPASS) return true;

  const data = {
    email,
  };
  try {
    const res = await api.axios.post(ENDPOINT, data);
    if (res?.status < 400) {
      const { data } = res;
      log.warn(`${METHOD} -`, data);
      return true;
    }
  } catch (error) {
    log.error(`${METHOD} -`, error);
  }
  return undefined;
}

export default recoveryByAxios;
