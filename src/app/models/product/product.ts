import { Global } from '../global/global';
import { Category } from '../category/category';
import {User} from '../user/user';
import {Tax} from '../tax/Tax';
import { Withholding } from '../withholding/Withholding';

export class Product {
    public _id: string;
    public description: string;
    public value: number;
    public stock: Number;
    public percentage_discount: Number;
    public unitary_discount: Number;
    public initial_discount: Date;
    public final_discount: Date;
    public points: Number;
    public category:Category;
    public medida:string;
    public code:string;
    public organization: any;
    public image_selected: string;
    public taxes?: Tax[];
    public withholdings?: Withholding[];
    public taxes_price: number;
    public withholdings_price: number;

    constructor(
        public name: string) {
        }
}

export interface ProductsBasket {
  products: InfoProductsBasket[];
  total_value: number;
  plaque: string;
  user?: User;
  isle: string;
}

export interface InfoProductsBasket {
  product: string;
  name: string;
  price: number;
  quantity: number;
}
