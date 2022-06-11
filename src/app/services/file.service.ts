import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseContentType } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer) { }
  getSafeUrl(link:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
  download(url:any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    console.log(url);
    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }
  getPdf(cv: any){
    this.download(cv).subscribe((blob: Blob): void => {
        const file = new Blob([blob], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank', 'width=1000, height=800');
      });
  }
  downloadPdf(cv: any, name:string){
  this.download(cv).subscribe((blob: Blob): void => {
      const file = new Blob([blob], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      let a = document.createElement('a');
      a.download = name + '.pdf';
      a.href = fileURL;
      a.click();
    });
  }
  convertVideoLink(link:string){
    link = link.split("&")[0];
    link = link.split("watch?v=")[0] + 'embed/' + link.split("watch?v=")[1];
    return link;
  }
}
