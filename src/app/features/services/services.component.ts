import { Component } from '@angular/core';
import { ServiceResponse } from '../../services/model/Services.model';
import { ServicesService } from '../../services/service/services.service';
import { CommonModule } from '@angular/common';
import { SecureImageDirective } from '../../directives/secure-image/secure-image.directive';
import { SeoService } from '../../services/seo/seo.service';
import { SEO_CONFIG } from '../../services/model/SEO_CONFIG.model';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    SecureImageDirective,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  allService:ServiceResponse[]=[];
  loading=false;
  loadingMore=false;
  isLastPage=false;
  totalElements=0;
  remainingCount=0;

  private currentPage=0;
  private readonly pageSize=10;

  constructor(private services:ServicesService,
    private seoService:SeoService
  ){}

  ngOnInit():void{
    this.loadInitial();
    this.seoService.setSEO(SEO_CONFIG.services);
  }
  loadInitial():void{
    this.loading=true;
    this.currentPage=0;

    this.services.getAllService(undefined,this.currentPage,this.pageSize)
    .subscribe({
      next:(res)=>{
        this.allService=res.content;
        this.isLastPage=res.last;
        this.totalElements=res.totalElements;
        this.remainingCount=this.totalElements-this.allService.length;
        this.loading=false;
      },
      error:(err:Error)=>{
        this.loading=false;
      }
    })
  }

  loadMore():void{
    if(this.isLastPage || this.loadingMore) return;

    this.loadingMore=true;
    this.currentPage++;

    this.services.getAllService(undefined,this.currentPage,this.pageSize).subscribe({
      next:(data)=>{
        this.allService=[...this.allService,...data.content];
        this.isLastPage=data.last;
        this.totalElements=data.totalElements;
        this.remainingCount=this.totalElements-this.allService.length;
        this.loadingMore=false;
      },
      error:(err:Error)=>{
        this.currentPage--;
        this.loadingMore=false;
      }
    })
  }

  getInitials(name:string):string{
    return name.split(' ')
    .map((n)=>n[0])
    .join('')
    .toUpperCase()
    .slice(0,2);
  }

}
