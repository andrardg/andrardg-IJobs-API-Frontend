import { Job } from "./job";
import { User } from "./user";

export class Invite {
    id?:string;
    userId:string;
    user?: User;
    jobId:string;
    job?: Job;
    constructor(){
    this.userId = '';
    this.jobId = '';
    }
}
