import { Domain } from './domain';
import { Tutorial } from "./tutorial";

export class Subdomain{
    id?:string;
    name:string;
    domainId:string;
    domain?:Domain;
    tutorials?:Array<Tutorial>;
    constructor(){
        this.name = '';
        this.domainId = '';
        this.domain = new Domain();
        this.tutorials = [];
    }
}