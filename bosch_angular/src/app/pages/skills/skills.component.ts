import { Component, OnInit } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

import { SkillsService } from './skills.service';

import { StationUser } from '../station_user';
import { STATION_USERS } from './mock-users';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  private config: ToasterConfig = new ToasterConfig({
    positionClass: "toast-bottom-right",
    timeout: 2000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: false,
    animation: 'fade',
    limit: 5,
  });  // 提示的配置

  private old_length: number;  // 保存的员工信息的长度

  private is_editable: boolean = false;  // 新添加的员工信息的card_id是否可编辑

  private toaset_title: string = "信息";

  private station_users: Array<StationUser>;  // 模拟的用户数据
  private editables: Array<boolean>;

  constructor(
    private skills_service: SkillsService, 
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.station_users = STATION_USERS;
    this.set_editables();
    this.skills_service.get_station_users().subscribe(
      (data) => {
        if (data['result']) {
          this.station_users = data['result'];
          this.set_editables();
          this.old_length = this.station_users.length;
          this.showToast('success', this.toaset_title, "数据更新成功！");
        } else {
          this.showToast('error', this.toaset_title, '服务器出错！');
        }

      },
      (err) => {
        this.showToast('error', this.toaset_title, "网络错误！");
      }
    );
  }

  set_editables(): void {
    this.editables = [];
    for (let i=0; i<this.station_users.length; i++) {
      this.editables.push(false);
    }
  }

  edit(index: number): void {
    // 编辑按钮事件
    this.editables[index] = true;
  }

  check_user(index: number): boolean {
    // 检查用户是否合格
    if (this.station_users[index].card_id.length !== 10) {
      this.showToast('error', this.toaset_title, "磁卡编号长度不符!");
      return false;
    }
    else if (this.station_users[index].user_number.length !== 8) {
      this.showToast('error', this.toaset_title, "员工ID长度不符!")
      return false;
    }
    else if (!this.station_users[index].name) {
      this.showToast('error', this.toaset_title, "员工姓名不能为空!")
      return false;
    }
    else if (!this.station_users[index].img_path) {
      this.showToast('error', this.toaset_title, "员工头像不能为空!")
      return false;
    } 
    else if (!this.check_unique_card_id()) {
      this.showToast('error', this.toaset_title, "磁卡编号不能重复!")
      return false;
    }
    else if (!this.check_unique_user_number()) {
      this.showToast('error', this.toaset_title, "员工编号不能重复!")
      return false;
    }
    return true;
  }

  check_unique_card_id(): boolean {
    // 检查卡编号是否唯一
    if (this.station_users.length === 1) {
      return true;
    }
    let temp = new Set();
    for ( let user of this.station_users ) {
      temp.add(user.card_id);
    }
    if (temp.size === this.station_users.length) {
      return true;
    }
    return false;
  }

  check_unique_user_number(): boolean {
    // 检查员工编号是否唯一
    if (this.station_users.length === 1) {
      return true;
    }
    let temp = new Set();
    for ( let user of this.station_users ) {
      temp.add(user.user_number);
    }
    if (temp.size === this.station_users.length) {
      return true
    }
    return false
  }

  selected_img(fileInput: any, index: any): void {
    // 改变头像的路径
    let file = fileInput.target.files[0];
    if(file){
      this.station_users[index].img_path = file.name;
    }
  }

  add_user(): void {
    // 增加一个员工信息
    let temp_user: StationUser = {
      card_id: '',
      user_number: '',
      img_path: '',
      name: '',
      authority: [
        {"station": "ST10", "value": false},
        {"station": "ST20", "value": false},
        {"station": "ST30", "value": false},
        {"station": "ST40", "value": false},
        {"station": "ST50", "value": false},
        {"station": "ST60", "value": false},
        {"station": "ST70", "value": false},
      ]
    };
    this.station_users.push(temp_user);
    this.editables.push(true);
    this.is_editable = true;
  }

  save(index: any): void {
    // 保存员工信息到数据库
    if (!this.check_user(index)) {
      return
    }
    if (this.station_users.length - 1 === index) {
      this.is_editable = false;
    }
    this.skills_service.save_station_user(this.station_users[index]).subscribe(
      (data) => {
        if (data['result']) {
          this.old_length = this.station_users.length;
          this.showToast('success', this.toaset_title, "保存成功！");
        } else {
          this.showToast('error', this.toaset_title, "服务器出错！");
        }
      },
      (err) => {
        this.showToast('error', this.toaset_title, "网络错误！");
      }
    );
    this.editables[index] = false;
  }

  delete(index: any): void {
    // 删除对应的用户
    if (window.confirm('确定删除该用户吗？')) {
      if(this.old_length !== this.station_users.length) {
          this.is_editable = false;
          this.station_users.splice(index, 1);
          this.editables.splice(index, 1);
          return;
      }

      this.skills_service.delete_station_user(this.station_users[index].card_id).subscribe(
        (data) => {
          if (data['result']) {
            this.showToast('success', this.toaset_title, "删除成功！");
            this.station_users.splice(index, 1);
            this.editables.splice(index, 1);

          } else {
            this.showToast('error', this.toaset_title, "服务器错误！");
          }
        },
        (err) => {
          this.showToast('error', this.toaset_title, "网络错误！");
        }
      );
    }
  }

  test(): void {
    // 测试

  }

  private showToast(type: string, title: string, body: string) {
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: 2000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  clearToasts() {
    this.toasterService.clear();
  }


}
