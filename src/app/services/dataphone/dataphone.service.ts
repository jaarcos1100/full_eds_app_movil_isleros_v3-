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
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }

  async startPrint(datos: any): Promise<any> {
    try {
      let response = await dataphone['print']({ json: JSON.stringify(datos) });
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }

  async startPrintCloseShift(datos: any): Promise<any> {
    try {
      let response = await dataphone['printShiftClosureTicket']({ json: JSON.stringify(datos) });
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }

  async startPrintQR(datos: any): Promise<any> {
    try {
      let response = await dataphone['printQrTicket']({ json: JSON.stringify(datos) });
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }
}
