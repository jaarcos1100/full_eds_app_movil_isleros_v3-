import { Global } from '../global/global';
import { Ubication } from '../ubication/ubication';

export class Company {
    public _id: string;
    public electronic_signature: string;
    public phones: [string];
    public emails: [string];
    public adress: string;
    public status: string;
    public points: Number;
    public ubication:Ubication;
    public id?: string;
    public anticipateBalance?:number;

    constructor( public name: string,
        public nit: string, public digit_check: string, public credit: number) {
        }
}
