import { Component, inject }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient }           from '@angular/common/http';
import { toast }                from 'ngx-sonner';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserStateService } from '../../../../../statemanagement/User/user-state.service';
import { SystemUserResponse, UserService } from '../../../../../services/User/user.service';
import { environment } from '../../../../../../environments/environment.development';


@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule, RouterModule, 
    UserFormComponent
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  private router    = inject(Router);
  private userState = inject(UserStateService);
  private userService= inject(UserService);

  isLoading = false;


  onSubmit(payload: any) {
    this.isLoading = true;

    this.userService.addSystemUser(payload).subscribe({
      next: (newUser) => {
        this.isLoading = false;
        this.userState.addUser(newUser);
        toast.success('User created!', { description: `${newUser.name} added` });
        this.router.navigate(['/admin/users']);
      },
      error: (e) => {
        this.isLoading = false;
        toast.error(e?.error?.errorCode ?? 'Error', {
          description: e?.error?.message ?? 'Failed to create user'
        });
      }
    });
  }

}
