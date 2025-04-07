import {User} from '../user/user';
import {Company} from '../company/company';

export interface Vehicle {
  _id?: string;
  plaque: string;
  user?: User;
  company?: Company;
  iButton?: string;
}
