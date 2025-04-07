import { Global } from '../global/global';
import { Company } from '../company/company';
import { Organization } from '../organization/organization';

export class Role {
    public _id: string;
    public company:Company;
    public organization:Organization;
    public vehicle:any;

    constructor(
        public title: string,
        public level: Number) {
        }
}