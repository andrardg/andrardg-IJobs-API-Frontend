import { Application } from "./application";

export class Interview {
    id?:string;
    applicationId:string;
    application?:Application;
    date:Date;
    isOnline:boolean;
    location:string;
    responseUser?:boolean;
    responseCompany?:boolean;
    constructor(){
        this.applicationId = '';
        this.date = new Date("06/06/2006");
        this.isOnline = false;
        this.location = '';
        this.responseCompany = true;
        this.responseUser = false;
    }
}
