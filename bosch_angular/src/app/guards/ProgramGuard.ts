import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { LOGIN_STATES } from '../login_states';

@Injectable()
export class ProgramRouteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    if (LOGIN_STATES.program_user) {
        // 有登录，返回
        console.log('true');
        return true;
    } 
    // 没有登录，则跳转到登录页面。
    console.log("跳转到登录界面");
    this.router.navigateByUrl('/login/program');
    return false;
  }
}