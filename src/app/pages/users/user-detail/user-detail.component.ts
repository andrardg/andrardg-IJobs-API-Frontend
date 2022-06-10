import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UsersService } from 'app/services/users.service';
import { User } from 'app/classes/user';
import { FileService } from 'app/services/file.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  public id: any;
  User = new User();
  aboutSection:boolean = true;
  admin = sessionStorage.getItem('Admin');
  user:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private sanitizer: DomSanitizer,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
    this.id = params['id'];
    console.log(this.id);
  });
  this.getUserDetails(this.id);
  if (JSON.parse(sessionStorage.getItem('User') || ""))
    this.user = JSON.parse(sessionStorage.getItem('User') || "")
  }

  getUserDetails(id:any){
    this.service.getUserDetails(id).subscribe(data=>{
      console.log(data);
      this.User = data;
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
  getCV(cv: any){
    this.fileService.getPdf(cv);
  }
  downloadCV(cv: any){
    this.fileService.downloadPdf(cv, this.User.firstName + '-' + this.User.lastName + '-' + 'CV')
  }
  getSafeUrl(url:any){
    return this.fileService.getSafeUrl(url);
  }
}
