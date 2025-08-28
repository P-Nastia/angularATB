import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Login} from './pages/auth/login/login';
import {Register} from './pages/auth/register/register';

export const routes: Routes = [
  {path: "home",component: Home},
  {path: "login",component: Login},
  {path: "register",component: Register},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
