import { WebPlugin } from '@capacitor/core';

import type { dataphonePlugin } from './definitions';

export class dataphoneWeb extends WebPlugin implements dataphonePlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async startSell(options: { value: string }): Promise<{ value: string }> {
    console.log('startSell', options);
    return options;
  }
}
