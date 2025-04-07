import { Global } from '../global/global';

export class Category {
    public _id: string;
    public description: string;
    public status:Number;

    constructor(
        public name: string) {
        }
}