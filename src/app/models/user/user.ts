import { Global } from '../global/global';

export class User {
    public _id: string;
    public verified: boolean;
    public password: string;
    public date_joined: string;
    public document: string;
    public type_document: string;
    public email: string;
    public phones: [string];
    public password_new: string;
    public password_old: string;
    public roles?: any[];
    public iButton?: string;
    public anticipateBalance?:number;


    constructor(
        public full_name: string) {
        }
}
