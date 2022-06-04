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

