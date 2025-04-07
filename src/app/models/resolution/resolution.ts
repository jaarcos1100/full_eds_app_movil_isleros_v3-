import { Global } from '../global/global';
import { Organization } from '../organization/organization';

export class Resolution {
    public _id: string;
    public resolutionKey: string;
    public resolutionPrefix: string;
    public resolutionNumber:Number;
    public resolutionRangeInitial:Number;
    public resolutionRangeFinal:Number;
    public resolutionValidFrom:Date;
    public resolutionValidUntil:Date;
    public status:Number;
    public ambient:Number;
    public organization:Organization;
    public position:Number;
    public type:Number;

    constructor() {
    }
}