import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  //saves login and password of user
 email: string="";
 password: string="";
 login() {
   console.log("Login user data",this.email,this.password);
 }
}
