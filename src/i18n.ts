import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  locale: locale ?? 'de',
  messages: (await import(`../messages/${locale ?? 'de'}.json`)).default
}));
