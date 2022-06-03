import { Company } from "./company";

export interface Job {
    JobTitle:string;
    Description?:string;
    Salary:number;
    JobType?:string;
    Experience?:string;
    Address?:string;
    Open?:Boolean;
    CompanyId:string;
    Company:any;
}
