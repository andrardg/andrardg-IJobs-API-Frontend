export class Account {
    id?:string;
    email:string;
    password:string;
    firstName?:string;
    lastName?:string;
    address?:string;
    type?:string;
    name?:string;
    role?:string;
    constructor(){
      this.email = '';
      this.password = '';
      this.type = '';
      this.role = '1';
    }
  }
  