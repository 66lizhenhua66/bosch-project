import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

import { LOGIN_STATES } from '../../../login_states';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;
  program_user: any;

  userMenu = [{ title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.mabo);
    // let temp_user = localStorage.getItem('program_user');
    // let temp_path = localStorage.getItem('img_path');
    if (LOGIN_STATES.program_user) {
      this.program_user = {'user': LOGIN_STATES.program_user, 'img_path': "/static/images/" + LOGIN_STATES.img_path}
    } else if (LOGIN_STATES.station_user) {
      this.program_user = {'user': LOGIN_STATES.station_user, 'img_path': "/static/images/" + LOGIN_STATES.img_path}
    } else {
      this.program_user = {'user': '未登录', 'img_path': ''};
    }
    console.log(this.program_user);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    // 图标点击事件
    // this.menuService.navigateHome();
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
