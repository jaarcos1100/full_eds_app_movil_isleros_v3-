import {Company} from '../company/company';
import {Discount} from '../discount/Discount';
import {User} from '../user/user';

export interface UserDataInvoice {
  companies: Company[] | any;
  users: User[] | any;
  descuento1: Discount;
  vehicle_id?: string;
}

// export interface UserInvoice {
//   full_name: string;
//   _id: string;
//   type_document: number;
//   name: string;
//   document: string;
// }
