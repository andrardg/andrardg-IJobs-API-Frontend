import { Interview } from "./interview";
import { Job } from "./job";
import { User } from "./user";

export class Application {
    id?:string;
    jobId:string;
    job?:Job;
    userId:string;
    user?:User;
    cv:string;
    status:string;
    interviews?:Array<Interview>;
    constructor(){
        this.jobId = '';
        this.job = new Job();
        this.userId = '';
        this.user = new User();
        this.cv = '';
        this.status = 'Pending';
        this.interviews = [];
    }
}
