import { Global } from '../global/global';
import { Isle } from '../isle/isle';
import { Hose } from '../hose/hose';
import { User } from '../user/user';
import { Company } from '../company/company';
import {Product} from '../product/product';

export class Sale{
    public _id: string;
    public user:User;
    public hose:Hose;
    public vehicle:any;
    public company: Company;
    public date:Date;
    public volume: number;
    public total_value: number;
    public price: number;
    public numeration:Number;
    public mileage: Number;
    public copies:Number;
    public type:Number;
    public payment_method:String;
    public dateBegin?: number;
    public plaque: string;
    public basketSale: boolean;
    public status: number;
    public products: Product[];
    public is_vale:boolean;

    constructor(public id_sale:String) {}
}
