import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';

import { LOGIN_STATES } from '../login_states';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  private out_titles: Array<string> =  ['。', '。。', '。。。', '。。。。'];  // 退出的动画字样
  private show_title: string;

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.show_title = this.out_titles[0];
  }

  ngOnInit() {
    this.logout();
    
    for (let i=1; i<this.out_titles.length; i++) {
      setTimeout(() => {
        this.show_title = this.out_titles[i];
      }, 800 * i);
    }
    
    let temp = this.route.snapshot.paramMap.get('id');
    let url = '';
    if (temp) {
      url = '/login/station/' + temp;
    } else {
      url = '/login/program';
    }
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 3000)
  }

  logout(): void {
    // 清掉存储的用户
    LOGIN_STATES.img_path = '';
    LOGIN_STATES.program_user = '';
    LOGIN_STATES.station_user = '';
  }

}
