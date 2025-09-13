import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserCredentials } from '../core/models/user-credentials';
import { ApiService } from '../core/services/api/api.service';
import { AuthenticationService, TOKEN } from '../core/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { SweetAlertService } from '../core/services/alert/sweet-alert.service';

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


  constructor(private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticationService,
    private route: Router,
    private alert: SweetAlertService) {

    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^\S+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
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
            sessionStorage.setItem(TOKEN, response.body.token);
            this.route.navigate(['dashboard'])
            this.isLoading = false;
            this.alert.Toast.fire({
              icon: "success",
              title: "You logged in successfully."
            });
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
