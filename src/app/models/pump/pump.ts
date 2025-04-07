import { Global } from '../global/global';
import { Isle } from '../isle/isle';
import { Hose } from '../hose/hose';

export class Pump {
    public _id: string;
    public name:String;
    // public isle:Isle;
    public hoses:[Hose]

    constructor(public id_pump: number) {
        }
}
