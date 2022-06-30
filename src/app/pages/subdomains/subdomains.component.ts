import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subdomains',
  templateUrl: './subdomains.component.html',
  styleUrls: ['./subdomains.component.scss']
})
export class SubdomainsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
  }

}
