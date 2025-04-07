import { Product } from '../product/product';
import {Side} from '../side/Side';

export class Hose {
    public _id: string;
    public name: string;
    public position: number;
    public product: Product;
    public side: Side;
    public volume?: any;

    constructor(public id_hose: number) {
    }
}

export interface ShiftHose {
  hose: string;
  valume: number;
}
