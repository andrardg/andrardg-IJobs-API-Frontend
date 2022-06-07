import { SafeResourceUrl } from "@angular/platform-browser";
import { Subdomain } from "./subdomain";

export class Tutorial{
    id?:string;
    link:string;
    subdomainId:string;
    subdomain?:Subdomain;
    url?:SafeResourceUrl;
    constructor(){
        this.link = '';
        this.subdomainId = '';
        this.subdomain = new Subdomain();
    }
}