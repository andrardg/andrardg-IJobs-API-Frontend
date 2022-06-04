import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  public id: any;
  User: any;
  aboutSection:boolean = true;
  cv:any = 'No CV to show.';
  admin = sessionStorage.getItem('Admin');

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
    this.id = params['id'];
    console.log(this.id);
  });
  this.getUserDetails(this.id);
  }

  getUserDetails(id:any){
    this.service.getUserDetails(id).subscribe(data=>{
      console.log(data);
      this.User = data;
      if(data.cv){
        var file = data.cv;
        this.cv = this.sanitizer.bypassSecurityTrustResourceUrl(data.cv);
      }
    });
  }
  aboutTrue(){
    this.aboutSection = true;
  }
  aboutFalse(){
    this.aboutSection = false;
  }
  editUser(){
    this.router.navigate(['/users/edit', this.id]);
  }
}
