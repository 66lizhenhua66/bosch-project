import { Component, OnInit, ElementRef } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

import { STATIONS } from '../option';

import { ProgramsService } from '../programs.service';
import { Program } from '../program';
import { Hand } from '../step';

import 'style-loader!angular2-toaster/toaster.css';



@Component({
  selector: 'crafts',
  templateUrl: './crafts.component.html',
  styleUrls: ['./crafts.component.scss']
})
export class CraftsComponent implements OnInit {

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
  

  private STATIONS;  // 通过options.ts获得的工站所有下拉框选项
  private all_programs: Program[];  // 所有的程序

  private selected_station;  // 当前选中的工站
  private programs: Array<Program>;  // 当前选中工站的所有程序
  private selected_program: Program;  // 当前选中的程序

  private new_p_number: string;  // 新添加程序的名字
  private save_new_number: string;  // 保存为新的名字
  private rename_name: string;  // 重命名

  private default_p_number: string;  // 每个工站默认选中的程序下标

  private product_number: string = '';


  constructor(
    private programs_service: ProgramsService, 
    private toasterService: ToasterService,
    private el: ElementRef,
  ) { 
   
  }

  ngOnInit() {
    this.STATIONS = STATIONS;
    this.selected_station = this.STATIONS[0];  // 默认选中第一个

    this.all_programs = this.programs_service.get_programs();
    this.programs_service.download_programs().subscribe(
      (data) => {
        if(data['result']){

          this.all_programs = data['result'];
          this.init_program();
          this.showToast('success', this.toaset_title, "数据更新成功！");
        }
      },
      (err) => {
        this.showToast('error', this.toaset_title, "连接出错，请检查网络！");
        console.log(err);
      }
    );
    this.init_program();
    // console.log(this.selected_program);
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

  init_program(): void {
    // 更新选中的工站信息
    this.programs = this.get_programs_by_station(this.selected_station.station_name);  // 拿到当前工站的所有程序
    this.selected_program = this.programs[0];  // 默认选中第一个程序
    this.default_p_number = this.selected_program.program_number;

    // 初始化几个名字变量
    this.new_p_number = '';
    this.save_new_number = '';
    this.rename_name = '';
    this.selected_program.product_number ? 
      this.product_number = this.selected_program.product_number:
      this.product_number = '';
  }

  get_programs_by_station(station: string): Program[] { 
    // 获得指定工作站的所有程序
    let temp_programs: Program[] = [];
    for(let i=0; i<this.all_programs.length; i++) {
      if(this.all_programs[i].station === station) {
        temp_programs.push(this.all_programs[i]);
      }
    }
    return temp_programs;
  }

  change_station(station: any): void{
    // 工位改变，改变selected_p 的值
    this.programs = this.get_programs_by_station(this.selected_station.station_name);
    for(let i=0; i<this.programs.length; i++) {
      if(this.programs[i].program_number === this.default_p_number) {
        this.selected_program = this.programs[i];
      }
    }
    // console.log(this.selected_program);
    // 初始化几个名字变量
    this.new_p_number = '';
    this.save_new_number = '';
    this.rename_name = '';
  }

  change_program(program: Program): void {
    // 程序改变，改变默认选中的程序的值
    this.default_p_number = program.program_number;
    this.selected_program.product_number ? 
      this.product_number = this.selected_program.product_number:
      this.product_number = '';
  }

  select_last_p(): void {
    // 选到最后一个程序
     
  }

  verify_program_number(program_number: string): boolean {
    // 校验名字是否规范
    if(program_number.length != 10) {
      this.showToast('error', this.toaset_title, "程序号长度不符！");
      return false
    }
    // 程序号已存在，不合格，不创建
    for(let i=0; i<this.programs.length; i++) {
      if(program_number === this.programs[i].program_number) {
        this.showToast('error', this.toaset_title, "程序号已存在！");
        return false
      }
    }
    return true
  }

  get_programs_by_number(program_number: string): Program[] {
    // 通过序列号，获得所有程序
    let temp_programs: Program[] = [];
    for(let i=0; i<this.all_programs.length; i++) {
      if(this.all_programs[i].program_number === program_number) {
        this.all_programs[i].product_number = this.product_number.trim();
        temp_programs.push(this.all_programs[i]);
      }
    }
    // console.log("程序号拥有：" + temp_programs.length);
    
    return temp_programs;
  }

  add_program(): void {
    // 添加新的程序号
    this.new_p_number = this.new_p_number.trim();  // 去掉空格
    if(this.verify_program_number(this.new_p_number)) {
      for(let i=0; i<this.STATIONS.length; i++) {
        let new_program: Program = {
          station: this.STATIONS[i].station_name, 
          program_number: this.new_p_number,
          detail_program: [],
        }
        this.all_programs.push(new_program);  // 将程序添加到该工站所有的programs中
        if(this.STATIONS[i].station_name === this.selected_station.station_name) {
          this.programs.push(new_program)
        }
      }
      this.default_p_number = this.new_p_number;
      this.selected_program = this.programs[this.programs.length-1];  // 将当前程序更新成新创建的程序

      // 将nb-popover隐藏
      let temp = document.getElementsByTagName("nb-popover")[0];
      temp["style"].display = "none";
    }
  }

  delete_program(): void {
    // 删除程序  如果只剩下一个 不允许删除
    // if(this.selected_program.prescriptions.length <= 1) {
    //   return;
    // } else {
    //   this.
      
    // }

    
  }

  save_program(): void {
    // 保存程序到服务器 
    let update_programs: Program[] = this.get_programs_by_number(this.selected_program.program_number);

    this.programs_service.update(update_programs)
    .subscribe(
      (data) => {
        // 保存成功的信息 {}
        if(data['result']) {
          this.showToast("success", this.toaset_title, "保存成功!");
        } else {
          this.showToast("error", this.toaset_title, "保存失败！");
        }
      },
      (error) => {
        this.showToast('error', this.toaset_title, "连接出错，请检查网络！");
        console.log(error);
      }
    );
  }

  save_new_program(): void{
    // 另存为新程序
    this.save_new_number = this.save_new_number.trim();
    if(this.verify_program_number(this.save_new_number)) {
      let new_programs: Program[] = JSON.parse(
        JSON.stringify(
          this.get_programs_by_number(this.selected_program.program_number)
        )
      );
      for(let i=0; i<new_programs.length; i++) {
        new_programs[i].program_number = this.save_new_number;
        this.all_programs.push(new_programs[i]);
        if(new_programs[i].station === this.selected_station.station_name) {
          this.programs.push(new_programs[i]);
        }

      }
      // let new_program: Program = JSON.parse(JSON.stringify(this.selected_program));  // 深拷贝当前的程序对象
      // new_program.program_number = this.save_new_number;
      // this.programs.push(new_program);  // 添加到当前集合
      this.default_p_number = this.save_new_number;
      this.selected_program = this.programs[this.programs.length-1];  // 重新选中
      let temp = document.getElementsByTagName("nb-popover")[0];
      temp["style"].display = "none";
    }

  }

  rename_program(): void{
    // 重命名
    this.rename_name = this.rename_name.trim();
    if(this.verify_program_number(this.rename_name)) {
      this.programs_service.rename(this.selected_program.program_number, this.rename_name)
      .subscribe(
        (data) => {
          if(data['result']) {
            const old_name = this.selected_program.program_number;
            for(let i=0; i<this.all_programs.length; i++) {
              if(old_name === this.all_programs[i].program_number) {
                this.all_programs[i].program_number = this.rename_name;
              }
            }
            this.default_p_number = this.rename_name;
            let temp = document.getElementsByTagName("nb-popover")[0];
            temp["style"].display = "none";
            this.showToast('success', this.toaset_title, "重命名成功！");
            
          } else {
            this.showToast('error', this.toaset_title, "重命名失败！");
            console.log(data);
          }
        },
        (error) => {
          this.showToast('error', this.toaset_title, "连接出错，请检查网络！");
          console.log(error);
        }
      )

      
    }
  }


  private i: number = 1;  // 测试使用

  add_step(): void {
    // 添加一个step到当前配方
    let new_step: Hand = {
      is_auto: false,
      step_name: this.selected_station.steps[0].step_name,
      is_ptl: false,
      ptl_pos: '',
      left_pdf: '',
      right_pdf: '',
      use_torque: false,
      use_count: ''
      
    }
    this.selected_program.detail_program.push(new_step);
  }




  

}
