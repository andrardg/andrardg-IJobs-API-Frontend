import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Domain } from 'app/classes/domain';
import { Subdomain } from 'app/classes/subdomain';
import { Tutorial } from 'app/classes/tutorial';
import { DomainService } from 'app/services/domain.service';
import { FileService } from 'app/services/file.service';
import { SubdomainService } from 'app/services/subdomain.service';
import { TutorialService } from 'app/services/tutorial.service';
import * as deepmerge from 'deepmerge';

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

  addNewSubdomain: boolean = false;
  newSubdomain = new Subdomain();

  addNewTutorial : boolean = false;
  newTutorial = new Tutorial();

  domainIdUrl:any;
  subdomainIdUrl:any;
  constructor(private router:Router,
    private activatedRoute:ActivatedRoute,
    private domainService: DomainService,
    private subdomainService: SubdomainService,
    private tutorialService: TutorialService,
    private fileService: FileService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    
    this.activatedRoute.params.subscribe((params: any) => {
      //this.getTutorials();
      this.domainIdUrl = params['domainId'];
      this.subdomainIdUrl = params['subdomainId'];
      this.getDomainList();
    });
  }
  seeAll(){
    this.router.navigate(['/tutorials']);
  }

  getDomainList(){
    this.tutorialService.getTutorials().subscribe(data =>{
      this.TutorialList=data;
      this.Tutorials = data;
      this.domainService.getDomains().subscribe(data=>{
        this.DomainList=data;
        this.DomainList = this.DomainList.sort((a,b) => a.name.localeCompare(b.name));
        if(this.domainIdUrl){
          this.selectedDomain = this.DomainList.filter( x=> x.id == this.domainIdUrl)[0];
          if(this.selectedDomain) //if ok
            this.getSubdomainList(this.domainIdUrl);
          else
            this.seeAll();
        }
      });
    });
  }
  getSubdomainList(id:any){
    //if(this.newDomain.name == ''){
      this.SubdomainList=this.selectedDomain.subdomains!;
      this.SubdomainList = this.SubdomainList.sort((a,b) => a.name.localeCompare(b.name));
      if(this.subdomainIdUrl){
        this.selectedSubdomain = this.SubdomainList.filter( x=> x.id == this.subdomainIdUrl)[0];
        if(this.selectedSubdomain)
          this.selectTutorials();
        else
          this.selectedDomainId(id);
      }
      else
      this.Tutorials = this.TutorialList.filter(x=> x.subdomain!.domainId == id);
    //}
  }
  getTutorials(){
    this.tutorialService.getTutorials().subscribe(data =>{
      this.TutorialList=data;
      this.Tutorials = data;
    });
  }
  selectedDomainId(id:any){
    this.router.navigate(['/tutorials', id]);
  }
  selectedSubdomainId(id:any){
    this.router.navigate(['/tutorials', this.domainIdUrl, id]);
  }
  selectTutorials(){
    this.Tutorials = this.TutorialList.filter(x => x.subdomainId == this.subdomainIdUrl);
  }
  getSafeUrl(link:string){
    return this.fileService.getSafeUrl(link);
  }
  editDomainTrue(row:any){
    this.newDomain = {...row};
  }
  renameDomain(){
    this.domainService.saveDomain(this.newDomain).subscribe(data=>{
      console.log("Edited successfully");
      this.getDomainList();
      this.cancel();
    });
  }
  addDomain(){
    this.addNewDomain = true;
  }
  saveDomain(){
    this.domainService.createDomain(this.newDomain).subscribe(data=>{
      console.log("Saved successfully");
      this.getDomainList();
      this.cancel();
    });
  }
  deleteDomain(id:any){
    if (confirm('Are you sure you want to delete this domain?')) {
      this.domainService.removeDomain(id).subscribe(data=>{
        console.log("Deleted successfully");
        this.getDomainList();
        this.cancel();
      })
    } else {
      console.log('Not deleted');
    }
  }

  editSubdomainTrue(row:any){
    this.newSubdomain = {...row};
  }
  renameSubdomain(){
    this.subdomainService.saveSubdomain(this.newSubdomain).subscribe(data=>{
      console.log("Edited successfully");
      this.getDomainList();
      this.cancel();
    });
  }
  addSubdomain(){
    this.addNewSubdomain = true;
  }
  saveSubdomain(){
    this.newSubdomain.domainId = this.selectedDomain.id!;
    delete this.newSubdomain.domain;
    this.subdomainService.createSubdomain(this.newSubdomain).subscribe(data=>{
      console.log("Saved successfully");
      this.getDomainList();
      this.cancel();
    });
  }
  deleteSubdomain(id:any){
    if (confirm('Are you sure you want to delete this subdomain?')) {
      this.subdomainService.removeSubdomain(id).subscribe(data=>{
        console.log("Deleted successfully");
        this.getDomainList();
        this.cancel();
    })
    } else {
      console.log('Not deleted');
    }
  }

  addTutorial(){
    this.addNewTutorial = true;
  }
  saveTutorial(){
    this.newTutorial.link = this.fileService.convertVideoLink(this.newTutorial.link)
    this.addNewTutorial = false;
    this.newTutorial.subdomainId = this.selectedSubdomain.id!;
    delete this.newTutorial.subdomain;
    this.tutorialService.createTutorial(this.newTutorial).subscribe(data=>{
      console.log("Saved successfully");
      this.getDomainList();
      this.cancel();
    });
  }
  deleteTutorial(id:any){
  if (confirm('Are you sure you want to delete this subdomain?')) {
    this.tutorialService.removeTutorial(id).subscribe(data=>{
      console.log("Deleted successfully");
      this.getDomainList();
    })
  } else {
    console.log('Not deleted');
  }
}
cancel(row?:any){
  this.addNewTutorial = false;
  this.newTutorial = new Tutorial();
  this.addNewSubdomain = false;
  this.newSubdomain = new Subdomain();
  this.addNewDomain = false;
  this.newDomain = new Domain();
}
}
