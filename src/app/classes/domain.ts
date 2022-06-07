import { Subdomain } from "./subdomain";

export class Domain {
    id?:string;
    name:string;
    subdomains?:Array<Subdomain>;
    constructor(){
        this.name = '';
        this.subdomains = [];
    }
}