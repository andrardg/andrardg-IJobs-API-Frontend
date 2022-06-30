import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public id:number = 0;
  constructor(private activatedRoute: ActivatedRoute,
    private router:Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    if(sessionStorage.getItem('Company') != null)
      {var company = JSON.parse(sessionStorage.getItem('Company') || "")
      this.router.navigate(['/companies/edit', company.id]);}

    if(sessionStorage.getItem('User') != null)
      {console.log(sessionStorage.getItem('User'));var user = JSON.parse(sessionStorage.getItem('User') || "")
      this.router.navigate(['/users/edit', user.id]);}

    if(sessionStorage.getItem('Admin') != null)
    {var admin = JSON.parse(sessionStorage.getItem('Admin') || "")
    this.router.navigate(['/users/edit', admin.id]);}
  }

}
