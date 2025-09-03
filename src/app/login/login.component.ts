import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  invalidLogin = false;
  showPassword = false;

  constructor() { }

  onLogin() {
    // this.api.login(this.username , this.password)
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
