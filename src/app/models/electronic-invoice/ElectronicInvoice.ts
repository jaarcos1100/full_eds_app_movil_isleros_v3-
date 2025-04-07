import {User} from '../user/user';
import {Company} from '../company/company';
import {Sale} from '../sale/sale';

export interface ElectronicInvoice {
  // user: User;
  company: Company;
  sales: Sale[];
}
