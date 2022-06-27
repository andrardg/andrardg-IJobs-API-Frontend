import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UsersService } from 'app/services/users.service';
import { User } from 'app/classes/user';
import { FileService } from 'app/services/file.service';
import { CompaniesService } from 'app/services/companies.service';
import { MatDialog } from '@angular/material/dialog';
import { InviteComponent } from 'app/pages/invite/invite.component';

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
  company:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private companyService: CompaniesService,
    private fileService: FileService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    this.activatedRoute.params.subscribe((params: any) => {
    this.id = params['id'];
    console.log(this.id);
  });
  this.getUserDetails(this.id);
  if (sessionStorage.getItem('User') != null)
    this.user = JSON.parse(sessionStorage.getItem('User') || "")
  else if (sessionStorage.getItem('Company') != null)
    this.company = JSON.parse(sessionStorage.getItem('Company') || "")
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
  invite(){
    this.dialog.open(InviteComponent,{
      data : {
        userId : this.id
      }
    });
  }
}
