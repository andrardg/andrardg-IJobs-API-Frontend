import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      password:['', [Validators.required, Validators.minLength(5)]]
    });
  }

  doRegister(){
    console.log(this.myForm);
    if(this.myForm.valid){
      //apelam register cu ce avem in this.myForm.value
    }
  }

}
