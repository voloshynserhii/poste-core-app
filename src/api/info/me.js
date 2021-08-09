import { api } from '..';

const ENDPOINT = 'me';
const METHOD = 'me()';

export async function me() {
  if (process.env.REACT_APP_MULTIPASS)
    return {
      nameFirst: 'Leeloo',
      nameLast: 'Dallas',
      phone: '+1234567890',
      email: 'Leeloo.Dallas@Multipass.com',
    };

  try {
    const res = await api.axios.get(ENDPOINT);
    const { data } = res;
    log.warn(`${METHOD} -`, data);
    return data;
  } catch (error) {
    log.error(`${METHOD} -`, error);
  }
  return undefined;
}

export default me;
