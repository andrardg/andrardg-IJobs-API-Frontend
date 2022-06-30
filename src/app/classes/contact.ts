export class Contact {
    id?:string;
    email:string;
    title:string;
    message:string;
    resolved:boolean;
    constructor(){
        this.email = '';
        this.title = '';
        this.message = '';
        this.resolved = false;
    }
}
