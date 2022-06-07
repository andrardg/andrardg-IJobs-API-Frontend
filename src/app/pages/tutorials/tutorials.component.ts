import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Domain } from 'app/classes/domain';
import { Subdomain } from 'app/classes/subdomain';
import { Tutorial } from 'app/classes/tutorial';
import { DomainService } from 'app/services/domain.service';
import { SubdomainService } from 'app/services/subdomain.service';
import { TutorialService } from 'app/services/tutorial.service';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit {

  DomainList:Array<Domain> = [];
  SubdomainList:Array<Subdomain> = [];
  TutorialList:Array<Tutorial> = [];

  //didSelectDomain: boolean =
  selectedDomain = new Domain();
  selectedSubdomain = new Subdomain();
  Tutorials:Array<Tutorial> = [];
  error:any = '';
  admin = sessionStorage.getItem('Admin');

  addNewDomain: boolean = false;
  newDomain = new Domain();
  editDomain = new Domain();

  addNewSubdomain: boolean = false;
  newSubdomain = new Subdomain();
  editSubdomain = new Subdomain();

  addNewTutorial : boolean = false;
  newTutorial = new Tutorial();

  constructor(private router:Router,
    private domainService: DomainService,
    private subdomainService: SubdomainService,
    private tutorialService: TutorialService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getDomainList();
    this.getTutorials();
  }
  seeAll(){
    this.selectedDomain = new Domain();
    this.selectedSubdomain = new Subdomain();
    this.Tutorials = this.TutorialList;

  }
  getDomainList(){
    this.domainService.getDomains().subscribe(data=>{
      console.log(data);
      this.DomainList=data;
    });
  }

  getSubdomainList(domain:any){
    if(this.editDomain.name == ''){
      this.Tutorials = this.TutorialList.filter(x => x.subdomain!.domainId == domain.id);
      this.selectedDomain = domain;
      this.subdomainService.getSubdomainsFromDomain(domain.id).subscribe(data=>{
        console.log(data);
        this.SubdomainList=data;
    });
    }

  }
  getTutorials(){
    this.tutorialService.getTutorials().subscribe(data =>{
    this.TutorialList=data;
    if(this.selectedSubdomain.name == '')
      this.Tutorials=data;
    else
      this.selectTutorials(this.selectedSubdomain);
    console.log(this.Tutorials)
    });
  }
  selectTutorials(subdomain:any){
    this.selectedSubdomain = subdomain;
    this.Tutorials = this.TutorialList.filter(x => x.subdomainId == subdomain.id);
    console.log(this.Tutorials);
  }
  getSafeUrl(link:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(link );
  }
  editDomainTrue(row:any){
    this.editDomain = row;
  }
  renameDomain(row:any){
    console.log(event);
    this.editDomain.name = row.name;
    this.domainService.saveDomain(this.editDomain).subscribe(data=>{
      console.log("Edited successfully");
      this.getDomainList();
    });
    this.editDomain = new Domain();
  }
  addDomain(){
    this.addNewDomain = true;
  }
  saveDomain(){
    this.addNewDomain = false;
    this.domainService.createDomain(this.newDomain).subscribe(data=>{
      console.log("Saved successfully");
      this.getDomainList();
    });
  }
  deleteDomain(id:any){
    if (confirm('Are you sure you want to delete this domain?')) {
      this.domainService.removeDomain(id).subscribe(data=>{
        console.log("Deleted successfully");
        this.editDomain = new Domain();
        this.getDomainList();
      })
    } else {
      console.log('Not deleted');
    }
  }


  editSubdomainTrue(row:any){
    this.editSubdomain = row;
  }
  renameSubdomain(row:any){
    console.log(event);
    this.editSubdomain.name = row.name;
    this.subdomainService.saveSubdomain(this.editSubdomain).subscribe(data=>{
      console.log("Edited successfully");
      this.getSubdomainList(this.selectedDomain);
    });
    this.editSubdomain = new Subdomain();
  }
  addSubdomain(){
    this.addNewSubdomain = true;
  }
  saveSubdomain(){
    this.addNewSubdomain = false;
    console.log(this.selectedDomain)
    this.newSubdomain.domainId = this.selectedDomain.id!;
    delete this.newSubdomain.domain;
    this.subdomainService.createSubdomain(this.newSubdomain).subscribe(data=>{
      console.log("Saved successfully");
      this.getSubdomainList(this.selectedDomain);
    });
  }
  deleteSubdomain(id:any){
    if (confirm('Are you sure you want to delete this subdomain?')) {
      this.subdomainService.removeSubdomain(id).subscribe(data=>{
        console.log("Deleted successfully");
        this.editSubdomain = new Subdomain();
        this.getSubdomainList(this.selectedDomain);
      })
    } else {
      console.log('Not deleted');
    }
  }

  addTutorial(){
    this.addNewTutorial = true;
  }
  saveTutorial(){
    this.addNewTutorial = false;
    console.log(this.selectedDomain)
    console.log(this.selectedSubdomain)
    this.newTutorial.subdomainId = this.selectedSubdomain.id!;
    delete this.newTutorial.subdomain;
    this.tutorialService.createTutorial(this.newTutorial).subscribe(data=>{
      console.log("Saved successfully");
      this.getTutorials();
      this.newTutorial = new Tutorial();
      //this.selectTutorials(this.selectedSubdomain);
    });
  }
  deleteTutorial(id:any){
  if (confirm('Are you sure you want to delete this subdomain?')) {
    this.tutorialService.removeTutorial(id).subscribe(data=>{
      console.log("Deleted successfully");
      this.getTutorials();
      //this.seeAll();
      console.log(this.selectedSubdomain)
      //this.selectTutorials(this.selectedSubdomain);
    })
  } else {
    console.log('Not deleted');
  }
  }
}
