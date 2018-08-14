import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationLoginService } from './station-login.service';

import { LOGIN_STATES } from '../../login_states';


@Component({
  selector: 'station-login',
  templateUrl: './station-login.component.html',
  styleUrls: ['./station-login.component.scss']
})
export class StationLoginComponent implements OnInit {
  private id: string = '1';
  private user_name: string = '';

  private show_error: boolean = false;  // 是否显示登陆错误信息

  private interval: any;

  private id_2_station: any = {
    '1': 'ST10',
    '2': 'ST20',
    '3': 'ST30',
    '4': 'ST40',
    '5': 'ST50',
    '6': 'ST60',
    '7': 'ST70',
  }

  constructor(
    private route: ActivatedRoute, 
    private station_service: StationLoginService,
    private router: Router,
  ) { }


  ngOnInit() {
    this.get_station();
    console.log(this.id);

    this.interval = setInterval(() => {
      document.getElementById('user_name').focus();
    }, 500)



  }

  get_station(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  enter(): void {
    // 绑定回车事件
    if (this.check_user_name()) {
      this.login();
    } else {
      this.user_name = ''
      this.show_error = true;
      setTimeout(() => {this.show_error = false;}, 2000);
    }

  }

  check_user_name(): boolean {
    // 检查用户名是否合格： 0004380458
    if (this.user_name.length === 10) {
      return true;
    }
    return false;

  }

  login(): void {
    // station工站进行登陆
    this.station_service.login(this.user_name, this.id).subscribe(
      (data) => {
        if (data['result']) {
          let user_info = data['result'];
          LOGIN_STATES.station_user = user_info['show_name'];
          LOGIN_STATES.img_path = user_info['img_path'];
          LOGIN_STATES.user_number = user_info['user_number'];
          clearInterval(this.interval);
          this.router.navigateByUrl('/stations/' + this.id_2_station[this.id]);

        } else {
          this.user_name = '';
          this.show_error = true;
          setTimeout(() => {this.show_error = false;}, 2000);
        }

      },
      (err) => {
        console.log('网络错误！');
        this.user_name = '';
        setTimeout(() => {this.show_error = false;}, 2000);
      }
    );

  }

}
