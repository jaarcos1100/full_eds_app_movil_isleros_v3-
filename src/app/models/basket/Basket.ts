import {Product} from '../product/product';

export interface Basket {
  _id: string;
  stock: number;
  product: Product;
  dependency: any;
}
