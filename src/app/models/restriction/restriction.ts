export class Restriction {
    
    public _id: string;
    public type_sold: string;
    public is_vale: boolean;
    public is_cupo:boolean;
    public company:any;
    public require_print:boolean;
    public allow_anticipate:boolean;
    public anticipate_max_value:number;


    constructor() {
    }
}