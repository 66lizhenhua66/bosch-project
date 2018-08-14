import { Component, OnInit } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Program } from '../program';
import { Order } from './order';
import { catchError } from 'rxjs/operators';

import { OrdersService } from './orders.service';
import { ProgramsService } from '../programs.service';
import { isNumber } from 'util';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private config: ToasterConfig = new ToasterConfig({
    positionClass: "toast-bottom-right",
    timeout: 2000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: false,
    animation: 'fade',
    limit: 5,
  });  // 提示的配置
  private toaset_title: string = "信息";

  private sn_number: string;  // 首SN
  private count: string;  // 数量
  private order_number: string;  // 订单号

  private orders: Order[];  // 所有发布的订单
  private selected_orders: Order[] = [];  // 当前操作程序的所有订单
  

  private program_numbers: string[];  // 所有的程序号
  private selected_number: string;  // 默认选中的程序号


  constructor(
    private programs_service: ProgramsService, 
    private orders_service: OrdersService,
    private toasterService: ToasterService,
  ) { 

  }

  ngOnInit() {
    this.sn_number = '';
    this.count = '';
    this.order_number = '';

    this.orders = this.orders_service.get_mock_orders();
    this.program_numbers = this.orders_service.get_mock_pNumbers();  // 先将模拟数据进行加载

    this.selected_number = this.program_numbers[0];  // 默认选中第一个程序号
    this.refresh_form();

    // 从服务器获取数据，并更新表格
    this.orders_service.download_pNumbers().subscribe(
      (data) => {
        if('result' in data) {
          console.log('get numbers success!');
          console.log(data);
          this.program_numbers = data['result']['program_numbers'];
          this.selected_number = this.program_numbers[0];  // 获得服务器数据后默认选中第一个程序
          this.orders_service.download_orders().subscribe(
            (data) => {
              if('result' in data) {
                console.log('get orders success!');
                console.log(data);
                this.orders = data['result']['orders'];
                this.refresh_form();
                this.showToast('success', this.toaset_title, "更新数据成功！");
                
              } else {
                this.showToast('error', this.toaset_title, "更新数据失败！");
                console.log(data);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          console.log('get_numbers error!')
          console.log(data);
        }
      },
      (err) => {
        this.showToast('error', this.toaset_title, "连接出错，请检查网络！");
        console.log(err);
      }
    );

  }

  refresh_form(): void {
    // 数据更新后，进行更新表单的数据
    console.log('aaa');
    console.log(this.selected_number);
    this.selected_orders = [];  // 重置
    console.log('oooook')
    for(let order of this.orders) {
      if(order.program_number === this.selected_number) {
        this.selected_orders.push(order);
      }
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

  change_selected_p(): void{
    // 程序改变，更新form表单
    this.refresh_form();
  }

  verify_val(): boolean {
    // 验证sn,order_number, count是否正确
    this.count = this.count.trim();
    this.sn_number = this.sn_number.trim();
    this.order_number = this.order_number.trim();

    const reg = /^[0-9]+[0-9]*$/;  
    if (this.order_number.length !== 7) {
      this.showToast('error', this.toaset_title, "订单号应为7位！")
      return false
    } else if (this.sn_number.length !== 8) {
        this.showToast('error', this.toaset_title, "序列号应为8位！")
        return false
    } else if ((!reg.test(this.count)) || (!reg.test(this.sn_number))) {  
      this.showToast('error', this.toaset_title, "序列号或数量不是纯数字！")
      return false;  
    } 
    return true;
  }

  add_sn(): void {
    // 生成序号,递增
    if(this.verify_val()) {
      const temp_count = parseInt(this.count);
      const temp_sn = parseInt(this.sn_number);
      for(let i=0; i<temp_count; i++) {

        let order: Order = {
          order_number: this.order_number,
          program_number: this.selected_number,
          sn_number: (temp_sn + i).toString(),
          is_publish: false,
        }
        this.selected_orders.push(order);
      }
    }
  }

  delete_sn(order_index: number): void {
    // 删除选定的序列号
    this.selected_orders.splice(order_index, 1);

  }

  delete_unpublish(): void {
    // 删除所有未发布的序列号
    let delete_index = 0;
    for(let i=0; i<this.selected_orders.length; i++) {
      if(!this.selected_orders[i].is_publish){
        delete_index = i;
        break;
      }
    }
    if(delete_index === 0){
      return;
    }
    this.selected_orders.splice(delete_index, this.selected_orders.length);  // 从一个出现未发布的，删除后面所有的
  }

  publish_orders(): void {
    // 发布当前选择程序中的所有未发布的序列号
    let temp_len = this.selected_orders.length;
    let pulish_index = 0;
    let orders: Order[] = [];

    for(let i=0; i<temp_len; i++) {
      if(!this.selected_orders[i].is_publish){
        orders.push(this.selected_orders[i]);
      }
    }

    // 通过service服务发布出去，后续补充
    this.orders_service.publish_orders(orders).subscribe(
      (data) => {
        if(data['result']) {
          // 服务器返回true后，将所有订单设置为true
          this.showToast('success', this.toaset_title, "发布成功！");
          console.log('发布成功！');
          for(let i=0; i<temp_len; i++) {
            if(!this.selected_orders[i].is_publish) {
              this.selected_orders[i].is_publish = true;
            }
          }
        } else {
          this.showToast('error', this.toaset_title, "发布失败！");
          console.log('发布失败！');
          console.log(data);
        }

      },
      (err) => {
        console.log(err);
        this.showToast('error', this.toaset_title, "连接失败，请检查网络！");
      }
    );
  }


}
