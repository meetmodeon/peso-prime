import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SecureImageDirective } from '../../directives/secure-image/secure-image.directive';
import { TeamMemberResponse } from '../../services/model/team-member.model';
import { TeamMemberService } from '../../services/teamMember/team-member.service';
import { SeoService } from '../../services/seo/seo.service';
import { SEO_CONFIG } from '../../services/model/SEO_CONFIG.model';

@Component({
  selector: 'app-our-teams',
  imports: [
    CommonModule,
    SecureImageDirective
  ],
  templateUrl: './our-teams.component.html',
  styleUrl: './our-teams.component.scss'
})
export class OurTeamsComponent {
  members:TeamMemberResponse[]=[];
  loading=false;
  loadingMore=false;
  isLastPage=false;
  totalElements=0;

  private currentPage=0;
  private readonly pageSize=8

  constructor(
    private teamMemberService:TeamMemberService,
    private seoService:SeoService
  ){}

  ngOnInit():void{
    this.loadInitial();
  }

  loadInitial():void{
    this.loading=true;
    this.currentPage=0;

    this.teamMemberService.getAll(this.currentPage,this.pageSize).subscribe({
      next:(data)=>{
        this.members=data.content;
        this.isLastPage=data.last;
        this.totalElements=data.totalElements;
        this.loading=false;
      },
      error:()=>{
        this.loading=false;
      },
    });
    this.seoService.setSEO(SEO_CONFIG.our_teams)
  }

  //-Load More: appends next page to existing list

  loadMore():void{
    if(this.isLastPage || this.loadingMore) return;

    this.loadingMore=true;
    this.currentPage++;

    this.teamMemberService.getAll(this.currentPage, this.pageSize).subscribe({
      next:(data)=>{
        this.members=[...this.members,...data.content];
        this.isLastPage=data.last;
        this.totalElements = data.totalElements;
        this.loadingMore= false;
      },

      error:()=>{
        this.currentPage--;
        this.loadingMore=false;
      }
    })
  }

  //How many members are still hidden

  get remainingCount():number{
    return this.totalElements-this.members.length;
  }

  // Initials helper

  getInitials(name:string):string{
    return name
    .split(' ')
    .map((n)=>n[0])
    .join('')
    .toUpperCase()
    .slice(0,2);
  }

}
