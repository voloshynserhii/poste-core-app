const USERS = [
  {
    id: 'user1',
    name: 'user1111',
    email: 'op@op.com',
    password: 'password1111',
    currency: 'USD',
    country: 'UKR',
    city: 'Kyiv',
    lang: 'ru_ru',
    balance: 3452,
    bonusBalance: 1,
    active: true,
  },
  {
    id: 'user2',
    name: 'user2222',
    email: 'oper@op.com',
    password: 'password1111',
    currency: 'EUR',
    country: 'SK',
    city: 'Bratislava',
    lang: 'en_us',
    balance: 5200,
    bonusBalance: 1,
    active: false,
  },
];

export const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

export const languages = [
  {
    value: 'en_us',
    label: 'en',
  },
  {
    value: 'ru_ru',
    label: 'ru',
  },
];
export default USERS;
