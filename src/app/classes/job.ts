import { Application } from "./application";
import { Company } from "./company";
import { Invite } from "./invite";
import { Subdomain } from "./subdomain";
import { User } from "./user";

export class Job {
    id?:string;
    jobTitle:string;
    description?:string;
    salary:number;
    jobType?:string;
    experience?:string;
    address?:string;
    open?:Boolean;
    companyId:string;
    company?:Company;
    subdomainId:string;
    subdomain?:Subdomain;
    userId:string;
    user?:User;
    applications?: Array<Application>;
    invites?: Array<Invite>;
    constructor(){
        this.jobTitle = '';
        this.description = '';
        this.salary = 0;
        this.jobType = '';
        this.experience = '';
        this.open = true;
        this.companyId = '';
        this.subdomainId = '';
        this.userId = '';
    }
}
