import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserStateService } from '../../../../../statemanagement/User/user-state.service';
import {
  SystemUserResponse,
  UserService,
} from '../../../../../services/User/user.service';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, RouterModule, UserFormComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userState = inject(UserStateService);
  private userService = inject(UserService);

  userData = signal<SystemUserResponse | null>(null);
  isLoading = false;
  isFetching = true;

  private username!: string;

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    if(this.username){
      this.loadUser();
    }
  }

  private loadUser() {
    this.userService.getUserByUsername(this.username).subscribe({
      next: (user) => {
        this.userData.set(user);
        this.isFetching = false;
      },
      error: () => {
        this.isFetching = false;
        toast.error('Error', { description: 'Failed to load user' });
      },
    });
  }

  onSubmit(payload: any) {
    this.isLoading = true;
    this.userService.updateSystemUserInfo(this.username, payload).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.userState.updateUser(updatedUser);
        toast.success('Updated!', {
          description: `${updatedUser.name} updated`,
        });
        this.router.navigate(['/admin/users']);
      },
      error: (e) => {
        this.isLoading = false;
        toast.error(e?.error?.errorCode ?? 'Error', {
          description: e?.error?.message ?? 'Failed to update',
        });
      },
    });
  }
}
