import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { PaginatorState} from 'primeng/paginator';
import { toast } from 'ngx-sonner';
import {
  PageResponse,
  SystemUserResponse,
  UserService,
} from '../../../../../services/User/user.service';
import { UserStateService } from '../../../../../statemanagement/User/user-state.service';

@Component({
  selector: 'app-users',
  imports: [RouterLink, CommonModule, RouterModule,
     ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private userState= inject(UserStateService);

  users = this.userState.users;
  totalPages=0;

  currentPage = signal(0);
  pageSize= signal(10);
  isFirstPage=signal<boolean>(true);
  isLastPage=signal<boolean>(true);
  loading = signal(false);
  visiblePasswords: { [userId: string]: boolean } = {};



  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        console.log('loadMore data is: ',res);
        this.userState.setUsers(res.content,res.totalElements);
        this.totalPages=res.totalPages;
        this.isFirstPage.set(res.first);
        this.isLastPage.set(res.last)
        this.loading.set(false);

      },
      error: (e) => {
        toast.error('Error', {
          description: e?.error?.message ?? 'Failed to load users',
        });
        this.loading.set(false);
      },
    });
  }

  

  // Get initials from name
  getInitials(name: string): string {
    return name
      .split('')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN'
      ? 'bg-indigo-100 text-indigo-800'
      : 'bg-slate-100 text-slate-600';
  }

  togglePassword(userId: string) {
    this.visiblePasswords[userId] = !this.visiblePasswords[userId];
  }

  deleteUser(username:string){
    if(!confirm(`Delete ${username}?`)) return;

    this.userService.deleteUserByUsername(username).subscribe({
      next:()=>{
        this.userState.removeUser(username);
        toast.success('Deleted',{description: `${username} removed`});
      },
      error:(e)=>toast.error('Error',{description:e?.error?.message})
    });
  }

  goToPage(page:number):void{
    console.log("click page is: ",page);
    if(page<0 || page >=this.totalPages) return;
      this.currentPage.set(page);
      this.loadUsers();
    
  }

  get startItem():number{
    return this.currentPage()*this.pageSize()+1;
  }

  get endItem():number{
    return Math.min((this.currentPage()+1)*this.pageSize(),this.userState.totalElements())
  }

  getVisiblePages():number[]{
    const total = this.totalPages;
    const current= this.currentPage();
    const pages:number[]=[];

    if(total<=7) return Array.from({length:total},(_,i)=>i);

    pages.push(0);
    if(current > 2) pages.push(-1);

    for(let i=Math.max(1,current-1);i<=Math.min(total-2,current+1);i++){
      pages.push(i);
    }

    if(current<total-3) pages.push(-1);
    pages.push(total-1);

    return pages;

  }
}
