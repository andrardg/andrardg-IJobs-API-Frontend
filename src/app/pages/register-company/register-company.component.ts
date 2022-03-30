import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent implements OnInit {

  
  error = ''
  public myForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  
  constructor() { }

  ngOnInit(): void {
  }

}
