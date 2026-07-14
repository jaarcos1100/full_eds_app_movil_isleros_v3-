import { registerPlugin } from '@capacitor/core';

import type { dataphonePlugin } from './definitions';

const dataphone = registerPlugin<dataphonePlugin>('dataphone', {
  web: () => import('./web').then((m) => new m.dataphoneWeb()),
});

export * from './definitions';
export { dataphone };
