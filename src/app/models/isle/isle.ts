import { Global } from '../global/global';
import { Pump } from '../pump/pump';

export class Isle {
    public _id: string;
    public name: string;
    public status: number;
    public pumps: [Pump]

    constructor(public id_isle: number) {
        }
}
