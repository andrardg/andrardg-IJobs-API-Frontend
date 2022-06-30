import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'app/classes/contact';
import { ContactService } from 'app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public error: boolean | string = false;
  public contact = new Contact();
  public myForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    title: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])});

  constructor(private service: ContactService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
  }
  submit(){
    if(this.myForm.invalid){
      console.log("Submit error");
      if(this.myForm.controls['email'].invalid)
        this.error = 'The email has wrong format.';
      else if(this.myForm.controls['title'].invalid)
        this.error = 'You must enter a title.';
      else
        this.error = 'You must enter a message.'
      return;
    }
    this.error = false;
    this.contact.email = this.myForm.controls["email"].value;
    this.contact.title = this.myForm.controls["title"].value[0].toUpperCase() + this.myForm.controls["title"].value.slice(1);
    this.contact.message = this.myForm.controls["message"].value[0].toUpperCase() + this.myForm.controls["message"].value.slice(1);
    this.contact.resolved = false;
    this.service.createContact(this.contact).subscribe(data=>{
      console.log(this.contact)
      console.log("Created successfully");
      alert("Message sent successfully");
      this.myForm.reset();
    },
    error =>{
      alert("An error occured");
    });
  }
}
