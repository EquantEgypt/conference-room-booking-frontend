import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserCredentials } from '../core/models/user-credentials';
import { ApiService } from '../core/services/api/api.service';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  showPassword = false;
  isLoading = false;
  errorMessage = '';


  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthenticationService, private route: Router) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        // Validators.minLength(3),
        // Validators.maxLength(30),
        Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)  // must start with letter, then alphanumeric only
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(3), // temporarily just for testing security in backend
        Validators.pattern(/^\S+$/) /* \S matches any non-whitespace character , + one or more  */
      ]]
    })
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      let user: UserCredentials = this.loginForm.value;
      console.log(user.username, user.password);
      this.auth.authenticate(user).subscribe(
        {
          next: (response) => {
            this.route.navigate(['dashboard'])
            this.isLoading = false;
            console.log(response);
          },
          error: (err) => {
            if (err.status === 401) {
              this.errorMessage = 'Invalid Credentials';
            } else {
              this.errorMessage = 'Something went wrong. Please try again.';
            }
            this.isLoading = false;
            console.log(this.errorMessage);
          }
        }
      )
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }

  get username(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

}
