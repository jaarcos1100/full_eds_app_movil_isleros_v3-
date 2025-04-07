import {User} from '../user/user';
import {Product} from '../product/product';
import {Company} from '../company/company';

export interface Discount {
  _id?: string;
  unitary_discount?: number;
  user?: User;
  product: Product;
  company?: Company;
  percentage_discount?: number;
}
