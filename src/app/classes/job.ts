import { Company } from "./company";

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
    company:Company;
    constructor(){
        this.jobTitle = '';
        this.description = '';
        this.salary = 0;
        this.jobType = '';
        this.experience = '';
        this.open = true;
        this.companyId = '';
        this.company = new Company();
    }
}
