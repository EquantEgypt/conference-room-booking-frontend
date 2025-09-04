import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  // invalidLogin = false; 
  showPassword = false;


  constructor(private fb: FormBuilder) {
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
      const { username, password } = this.loginForm.value;
      console.log(username, password);
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
