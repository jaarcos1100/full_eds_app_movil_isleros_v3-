
export class Util {
  static listAux: Array<number> = [
    3,
    7,
    13,
    17,
    19,
    23,
    29,
    37,
    41,
    43,
    47,
    53,
    59,
    67,
    71
  ];
  static listEmailDomains: string[] = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'live.com',
    'hotmail.es',
    'yahoo.es',
  ];

  static getDigitVerification(nit: number): number {
    if (nit) {
      const nitText = nit.toString();
      const nuevo = nitText.split('');
      const reverseArray = nuevo.reverse();
      const joinArray = reverseArray.join('');
      let sum = 0;
      this.listAux.forEach((element, pos) => {
        if (pos < nitText.length) {
          sum += element * parseInt(joinArray.charAt(pos));
        }
      });
      const mod = sum % 11;
      if (mod === 0) {
        return 0;
      }
      if (mod === 1) {
        return 1;
      }
      if (mod > 1) {
        return 11 - mod;
      }
    } else {
      return NaN;
    }
  }

  static replaceAllStrings(originalString: string, searchValue: string, replaceValue: string): string {
    let result = '';
    for (let i = 0; i < originalString.length; i++) {
      const char = originalString[i];
      if (char !== searchValue) {
        result += char;
      }
    }
    return result;
  }

  static formatMoney(num: number): string {
    var p = num.toFixed(3).split(".");
    // convertir a array la parte decimal, invertir las posiciones y convertir a entero para quitar ceros a la derecha y luego regresar a string invirtiendo nuevamente
    const array = p[1].split('').reverse();
    p[1] = ((+array.join('')) + '').split('').reverse().join('');
    return "$ " + (p[0].split("").reverse().reduce(function (acc, num, i, orig) {
      return num == "-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
    }, "") + (p[1] != '0' ? "." + p[1] : ''));
  }
}
