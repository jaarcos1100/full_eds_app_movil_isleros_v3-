import { Global } from '../global/global';
import { Ubication } from '../ubication/ubication';

export class Organization {
    public _id: string;
    public logo: string;
    public adress: string;
    public email: string;
    public slogan: string;
    public phone: string;
    public alias: string;
    public web_page: string;
    public ubication: Ubication;
    public digit_check: string;
    public postal_code: string;

    constructor(
        public name: string,
        public nit: string) {
        }
}

export interface OrganizationInfo {
  organization: Organization;
  details: any;
}
