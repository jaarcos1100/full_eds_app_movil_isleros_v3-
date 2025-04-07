import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { dataphone } = Plugins;


export interface TransactionData {
  amount: string;
  tax: string;
  tip: string;
  iac: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataphoneService {

  constructor() { }

  async startSellTransaction(datos: TransactionData): Promise<any> {
    try {
      const response = await dataphone['startSell'](datos);
      console.log('Transacción enviada exitosamente:', response);
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }
}
