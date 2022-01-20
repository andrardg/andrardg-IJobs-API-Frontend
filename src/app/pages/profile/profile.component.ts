import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public id:number = 0;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: any) =>{
      console.log(params);
      this.id = parseInt(params['id']);
      console.log(this.id);
    });

    this.activatedRoute.queryParams.subscribe((qParams: any) => {
      console.log(qParams);
    });
  }

}
