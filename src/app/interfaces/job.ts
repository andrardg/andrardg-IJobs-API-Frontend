import { Company } from "./company";

export interface Job {
    JobTitle?:string;
    Description:string;
    Salary:number;
    JobType?:string;
    Experience?:string;
    Open?:Boolean;
    Company?:Company;
}
