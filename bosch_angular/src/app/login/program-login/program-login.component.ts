import { Component, OnInit } from '@angular/core';
import { ProgramLoginService } from './program-login.service';

import { LOGIN_STATES } from '../../login_states';

import { Router } from '@angular/router'

@Component({
  selector: 'program-login',
  templateUrl: './program-login.component.html',
  styleUrls: ['./program-login.component.scss']
})
export class ProgramLoginComponent implements OnInit {

  private user: string = '';  // 登录的用户名
  private pw: string = '';  // 登录的密码

  private show_error = false;  // 是否显示错误信息

  constructor(private login_service: ProgramLoginService, private router: Router) { }

  ngOnInit() {
  }

  enter(): void {
    // 回车事件
    this.login();
  }
  hide_error(): void {
    // 隐藏错误信息
    this.show_error = false;
  }

  login(): void {
    // 登录按钮的绑定事件
    if (this.check_user()) {
      this.login_service.login(this.user, this.pw).subscribe(
        (data) => {
          // data = {..., 'result': {'user': 'abc', 'img_path': '/img...'}}
          console.log(data);
          if (data['result']) {
            let user_info = data['result'];
            // localStorage.setItem('program_user', user_info['user']);
            // localStorage.setItem('img_path', user_info['img_path']);
            LOGIN_STATES.program_user = user_info['user'];
            LOGIN_STATES.img_path = user_info['img_path'];
            this.router.navigateByUrl('/pages/crafts');
          } else {
            console.log('用户名或密码错误。');
            this.show_error = true;
          }

        },
        (err) => {
          console.log("网络有问题", err);
        }
      );
    }

  }

  check_user(): boolean {
    // 检查登录的用户名密码是否合格
    if ( (this.user.length === 0) || (this.pw.length === 0)) {
      return false;
    }
    return true;
  }

}
