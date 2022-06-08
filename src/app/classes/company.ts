import { Job } from "./job";

export class Company {
    id?:string;
    name?:string;
    email:string;
    password:string;
    address?:string;
    description?:string;
    photo?:string;
    role?:string;
    verifiedAccount:boolean;
    jobs: Array<Job>;

    constructor(){
      this.name = '';
      this.email = '';
      this.password = '';
      this.address = '';
      this.description = '';
      this.photo = '';
      this.role = '1';
      this.verifiedAccount = false;
      this.jobs = [];
    }
  }
  