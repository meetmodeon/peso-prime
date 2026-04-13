import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TeamMemberService } from '../../../../../services/teamMember/team-member.service';
import { TeamMemberStateService } from '../../../../../statemanagement/team/team-member-state.service';
import { TeamMemberResponse } from '../../../../../services/model/team-member.model';
import { CommonModule } from '@angular/common';
import { PageResponse } from '../../../../../services/User/user.service';
import { SecureImageDirective } from '../../../../../directives/secure-image/secure-image.directive';

@Component({
  selector: 'app-teams',
  imports: [RouterLink,
    CommonModule,
    SecureImageDirective
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  currentPage=0;
  pageSize=10;
  totalPages=0;
  isFirstPage=true;
  isLastPage=true;
  loading=false;
  error:string|null=null;

  constructor(
    private teamMemberService:TeamMemberService,
    public state:TeamMemberStateService
  ){}

  ngOnInit():void{
    this.loadMembers();
  }

  loadMembers():void{
    this.loading=true;
    this.error=null;

    this.teamMemberService.getAll(this.currentPage,this.pageSize).subscribe({
      next:(data:PageResponse<TeamMemberResponse>)=>{
        this.state.setTeamMembers(data.content,data.totalElements);
        this.totalPages=data.totalPages;
        this.isFirstPage=data.first;
        this.isLastPage=data.last;
        this.loading=false;
      },
      error:(err)=>{
         this.error = 'Failed to load team members. Please try again.';
        this.loading = false;
      }
    })
  }

    goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadMembers();
  }
 
  deleteMember(id: number): void {
    if (!confirm('Are you sure you want to delete this team member?')) return;
 
    this.teamMemberService.delete(id).subscribe({
      next: () => this.state.removeTeamMember(id), // update state instantly, no reload
      error: (err) => {
        alert('Failed to delete team member.');
        console.error(err);
      },
    });
  }
 
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
 
  get startItem(): number {
    return this.currentPage * this.pageSize + 1;
  }
 
  get endItem(): number {
    return Math.min(
      (this.currentPage + 1) * this.pageSize,
      this.state.totalElements()
    );
  }
 
  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
 
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
 
    pages.push(0);
    if (current > 2) pages.push(-1);
 
    for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
      pages.push(i);
    }
 
    if (current < total - 3) pages.push(-1);
    pages.push(total - 1);
 
    return pages;
  }
}
