import { Component, OnInit } from '@angular/core';

import { MockData } from './mock-data';
import { ProgramUser } from '../program_user';

import { ManagerService } from './manager.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  private config: ToasterConfig = new ToasterConfig({
    positionClass: "toast-bottom-right",
    timeout: 2000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: false,
    animation: 'fade',
    limit: 5,
  });  // 提示的配置

  private users: Array<ProgramUser>;
  private editables: Array<boolean>;

  private toaset_title: string = "信息";



  constructor(
    private toasterService: ToasterService,
    private manager_service: ManagerService,
  ) {
    // const data = this.service.getData();
    this.users = MockData;
    this.set_editables();
    
  }

  ngOnInit() {
    // 从服务器更新数据
    this.manager_service.get_users().subscribe(
      (data) => {
        if (data['result']) {
          this.users = data['result'];
          this.set_editables();
          this.showToast('success', this.toaset_title, "数据更新成功！");
        } else {
          this.showToast('error', this.toaset_title, "服务器出错！");
        }
      },
      (err) => {
        this.showToast('error', this.toaset_title, "网络出错！");
      }

    );
  }

  set_editables(): void {
    // 根据对应的用户数量，生成对应的是否可编辑的布尔值列表,默认不可编辑
    this.editables = [];
    for (let i=0; i<this.users.length; i++) {
      this.editables.push(false);
    }
  }

  delete_user(index: number): void {
    // 删除对应id的用户
    // let index = 0;
    // for(let i=0; i<this.data.length; i++) {
    //   if (this.data[i].id === id) {
    //     index = i;
    //   }
    // }
    // this.data.splice(index, 1);
    // console.log(this.data);
    
  }




  test(): void {
    console.log(this.users);
    this.showToast('success', this.toaset_title, "数据更新成功！");
  }

  edit(index: any): void {
    // 编辑当前用户
    this.editables[index] = true;
  }

  add_user(): void {
    // 添加一个用户
    let temp_user: ProgramUser = {
      user: '',
      pw: '',
      show_name: '',
      img_path: '',
    };
    this.editables.push(true);
    this.users.push(temp_user);

  }

  save(index: any): void {
    // 保存对应的用户
    if (this.check_user(index)) {
      // 用户合格，做保存操作
      if (this.users[index].id) {
        this.manager_service.save_user(this.users[index], 'update').subscribe(
          (data) => {
            if (data['result']) {
              this.editables[index] = false;
              this.showToast('success', this.toaset_title, '保存成功！');
            }
          },
          (err) => {
            this.showToast('error', this.toaset_title, '网络错误!');
          }
        );
      } else {
        this.manager_service.save_user(this.users[index], 'insert').subscribe(
          (data) => {
            if (data['result']) {
              this.users[index].id = data['result']['new_user_id'];
              this.editables[index] = false;
              this.showToast('success', this.toaset_title, '保存成功！');
            }
          },
          (err) => {
            this.showToast('error', this.toaset_title, '网络错误!');
          }
        );

      }
      
      
    } 

  }

  delete(index: any): void {
    // 删除对应的用户
    if (window.confirm('确定删除该用户吗？')) {
      if( this.users[index].id ) {
        this.manager_service.delete_user(this.users[index].id).subscribe(
          (data) => {
            if (data['result']) {
              this.users.splice(index, 1);
              this.editables.splice(index, 1);
              this.showToast('success', this.toaset_title, '删除成功！');
            } else {
              this.showToast('error', this.toaset_title, '服务器出错！');
            }
          },
          (err) => {
            this.showToast('error', this.toaset_title, "网络出错！");
          }
        );
      } else {
          this.users.splice(index, 1);
          this.editables.splice(index, 1);
          this.showToast('success', this.toaset_title, '删除成功！');
      }
    } else {
      
    }
  }

  check_user(index): boolean {
    // 检测用户是否合格, 只要不是空值，都合格
    if ( !this.users[index].user ) {
      this.showToast('error', this.toaset_title, "用户名不能为空！");
      return false;
    } else if ( !this.users[index].pw ) {
      this.showToast('error', this.toaset_title, "密码不能为空！");
      return false;
    } else if ( !this.users[index].show_name ) {
      this.showToast('error', this.toaset_title, "真实姓名不能为空！");
      return false;
    } else if ( !this.users[index].img_path ) {
      this.showToast('error', this.toaset_title, "头像路径不能为空！");
      return false;
    } else if ( this.check_username(index) ) {
      this.showToast('error', this.toaset_title, "用户名重复！");
    }
    return true;
  }

  check_username(index): boolean {
    // 检查用户名是否重复
    for (let i=0; i<this.users.length; i++) {
      if ((i !== index) && (this.users[index].user === this.users[i].user)) {
        return true;
      }
    }
    return false;
  }

  selected_img(fileInput: any, index: any): void {
    // 改变头像的路径
    let file = fileInput.target.files[0];
    if(file){
      this.users[index].img_path = file.name;
    }
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



