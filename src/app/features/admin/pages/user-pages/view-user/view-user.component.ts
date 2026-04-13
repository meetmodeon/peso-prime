import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../../../services/User/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-user',
  imports: [
    CommonModule,
    RouterLink,

  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {
  showPassword: boolean = false;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.userService.getUserByUsername(username).subscribe(data => {
      this.user = data;
    });
  }
}
