import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  greeting = getGreeting();


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private authService:AuthService,
    private loginService:LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [false],
    });
  }

  get username() {
    return this.loginForm.get('username')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      username: this.username.value,
      password: this.password.value,
    };

    this.loginService.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authService.saveToken(res.jwt);
        toast.success('Welcome back!', {
          description: 'Login successful',
        });
        this.route.navigate(['/admin/dashboard']);
      },
      error: (e:Error) => {
        this.isLoading = false;
        toast.error('Login Failed',{
          description:e.message || 'Something went wrong',
        });
      },
    });
  }
}
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon!';
  return 'Good Evening';
}
