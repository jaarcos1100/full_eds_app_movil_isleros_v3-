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
      this.formatSaleReceiptAmounts(datos);
      let response = await dataphone['print']({ json: JSON.stringify(datos) });
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }

  async startPrintCloseShift(datos: any): Promise<any> {
    try {
      this.formatCloseShiftReceiptAmounts(datos?.body?.data);
      let response = await dataphone['printShiftClosureTicket']({ json: JSON.stringify(datos) });
      return response;
    } catch (error) {
      console.error('Error en la transacción del dataphone:', error);
      throw error;
    }
  }

  /**
   * Formato colombiano con separador de miles (.) y 2 decimales (,), ej: 1.234.567,89
   */
  private formatCOP(value: any): any {
    const numberValue = Number(value);
    if (value === undefined || value === null || isNaN(numberValue)) {
      return value;
    }
    const sign = numberValue < 0 ? '-' : '';
    const [integerPart, decimalPart] = Math.abs(numberValue).toFixed(2).split('.');
    const integerWithThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${sign}${integerWithThousands},${decimalPart}`;
  }

  private formatCloseShiftReceiptAmounts(recipeShift: any) {
    if (!recipeShift) {
      return;
    }
    if (recipeShift.Tven !== undefined) {
      recipeShift.Tven = this.formatCOP(recipeShift.Tven);
    }
    if (recipeShift.Tcan !== undefined) {
      recipeShift.Tcan = this.formatCOP(recipeShift.Tcan);
    }
    (recipeShift.surt || []).forEach((pump: any) => {
      Object.keys(pump).filter(key => key.startsWith('c')).forEach(key => {
        (pump[key]?.man || []).forEach((hose: any) => {
          if (hose.p !== undefined) {
            hose.p = this.formatCOP(hose.p);
          }
        });
      });
    });
  }

  private formatSaleReceiptAmounts(recipe: any) {
    if (!recipe) {
      return;
    }
    ['sub_total', 'imp', 'total', 'ret', 'anticipate'].forEach(key => {
      if (recipe[key] !== undefined) {
        recipe[key] = this.formatCOP(recipe[key]);
      }
    });
    if (recipe.desc) {
      ['d', 'ppu', 'v'].forEach(key => {
        if (recipe.desc[key] !== undefined) {
          recipe.desc[key] = this.formatCOP(recipe.desc[key]);
        }
      });
    }
    (recipe.prod || []).forEach((product: any) => {
      if (product.p !== undefined) {
        product.p = this.formatCOP(product.p);
      }
      if (product.v !== undefined) {
        product.v = this.formatCOP(product.v);
      }
    });
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
