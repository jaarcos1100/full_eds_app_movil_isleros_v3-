
type TypeTax = 'P' | 'M' | 'F';

 export interface Tax {
    code: string;
    rate: number;
    type: TypeTax;
 }
