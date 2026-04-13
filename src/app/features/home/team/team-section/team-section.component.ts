import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SecureImageDirective } from '../../../../directives/secure-image/secure-image.directive';
import { TeamMemberResponse } from '../../../../services/model/team-member.model';
import { TeamMemberService } from '../../../../services/teamMember/team-member.service';

@Component({
  selector: 'app-team-section',
  imports: [
    CommonModule,SecureImageDirective
  ],
  templateUrl: './team-section.component.html',
  styleUrl: './team-section.component.scss'
})
export class TeamSectionComponent {
  members:TeamMemberResponse[]=[];
  loading=false;

  constructor(private teamMemberService:TeamMemberService){}

  ngOnInit():void{
    this.loadTeam();
  }
  loadTeam():void{
    this.loading=true;

    //Fetch only first 4 members for the home section

    this.teamMemberService.getAll(0,4).subscribe({
      next:(data)=>{
        this.members=data?.content ?? [];
        this.loading=false;
      },
      error:()=>{
        this.members=[];
        this.loading=false;
      }
    });
  }

  getInitials(name:string):string{
    return name
    .split(' ')
    .map((n)=>n[0])
    .join('')
    .toUpperCase()
    .slice(0,2);
  }

}
