import { Component, input, output, OnInit, inject, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SystemUserRequest, SystemUserResponse } from '../../../../../services/User/user.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  // ← inputs from parent
  mode= input<'add' | 'edit'>('add');
  @Input()initialData:SystemUserRequest|null = null;
  isLoading   = input<boolean>(false);

  // output to parent
  formSubmit  = output<any>();

  showPassword = false;

  form = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(2)]],
    email:    ['', [Validators.email]],
    phone:    [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get name()     { return this.form.get('name')!;     }
  get email()    { return this.form.get('email')!;    }
  get phone()    { return this.form.get('phone')!;    }
  get password() { return this.form.get('password')!; }
  get isEdit()   { return this.mode() === 'edit';     }

  ngOnInit() {
    
    if (this.isEdit) {
      // ← password optional in edit mode
      this.password.clearValidators();
      this.password.updateValueAndValidity();

      // ← patch form if initial data provided
      const user = this.initialData;
      if (user) {
        this.form.patchValue({
          name:  user.name,
          email: user.email ?? '',
          phone: user.phone ?? '',
        });
      }
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      name:  this.name.value,
      email: this.email.value  || null,
      phone: this.phone.value  || null,
    };

    // ← only include password if filled
    if (this.password.value) {
      payload.password = this.password.value;
    }

    // ← emit to parent, parent handles API call
    this.formSubmit.emit(payload);
  }
}
