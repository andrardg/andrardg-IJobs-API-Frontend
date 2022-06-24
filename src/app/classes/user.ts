import { Application } from "./application";
import { Invite } from "./invite";
import { Job } from "./job";

export class User {
  id?:string;
  firstName?:string;
  lastName?:string;
  email:string;
  password:string;
  passwordHash:string;
  role?:string;
  residence?:string;
  occupation?:string;
  studies?:string;
  cv?:string;
  photo?:string;
  applications?: Array<Application>;
  invites?: Array<Invite>;
  jobs?:Array<Job>;

  constructor(){
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.passwordHash = '';
    this.role = '1';
    this.residence = '';
    this.occupation = '';
    this.studies = '';
  }
}

