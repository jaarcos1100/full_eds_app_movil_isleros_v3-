
type TypeWithholding = 'P' | 'M' | 'F';

 export interface Withholding {
    code: string;
    rate: number;
    type: TypeWithholding;
 }
