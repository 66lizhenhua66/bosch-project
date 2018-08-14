import { Component, OnInit, Input } from '@angular/core';


import { Program } from '../../program';
import { Auto, Hand } from '../../step';
import { STATIONS } from '../../option';




@Component({
  selector: 'eachcraft',
  templateUrl: './eachcraft.component.html',
  styleUrls: ['./eachcraft.component.scss']
})
export class EachcraftComponent implements OnInit {

  @Input() selected_program: Program;  // 该步骤对应的程序
  @Input() step_index: number;  // 该步骤对应的顺序
  @Input() step: Auto | Hand;  // 该步骤的对象

  @Input() OPTIONS: any;  // 下拉框的选项
 

  constructor() { 
  }

  ngOnInit() {

    // this.OPTIONS = STATIONS[this.selected_program.station];
    // Input() 修饰的变量，需在Init方法的时候才能获取到

  }

  test(): void {
  
  }

  change_stage(): void {
    // 改变阶段名称要做的事
    
  }

  selectedLeftFile(fileInput: any): void {
    // 选择左边PDF文件
    const file = fileInput.target.files[0];
    if(file){
      // 当选择文件之后，将文件名拼接出来

      // file.name = 'R123456789-ST10(1).pdf
      let directory = file.name.slice(0, 15);
      this.step.left_pdf = "/A10-WI/" + directory + "/" + file.name;
    }else {
      this.step.left_pdf = '';
    }
  }

  selectedRightFile(fileInput: any): void {
    // 选择右边pdf文件时的点击事件
    const file = fileInput.target.files[0];
    if(file){
      let directory = file.name.slice(0, 15);
      this.step.right_pdf = "/A10-WI/" + directory + "/" + file.name;
    }else {
      this.step.right_pdf = "";
    }

  }

  change_step(event: any): void {
    // 修改步骤后重置为默认值
    let is_auto: boolean;
    for(let i=0; i<this.OPTIONS.steps.length; i++) {
      if(event === this.OPTIONS.steps[i].step_name) {
        is_auto = this.OPTIONS.steps[i].is_auto;
      }
    }   
    let new_step: Auto | Hand;
    if(is_auto) {
      new_step = {
        is_auto: true,
        step_name: event,
        pro_num: '',
        count: '',
        left_pdf: '',
        right_pdf: '',
        stage_name: this.OPTIONS.stages[0],
        test_steps: [
          {
            test_name: this.OPTIONS.tests[0], data_type: this.OPTIONS.data_types[0],
            min: '2', max: '5', unit: 'Nm',
            comparison: this.OPTIONS.comparisons[0], precision: this.OPTIONS.precisions[0]
          },
        ],
      }
    } else {
      new_step = {
        is_auto: false,
        step_name: event,
        is_ptl: false,
        ptl_pos: '',
        left_pdf: '',
        right_pdf: '',
        use_torque: false,
        use_count: ''
      }
    }
    this.selected_program.detail_program[this.step_index] = new_step;
    // this.step = new_step;
  }

  

  delete_craft(): void{
    // 删除一个步骤
    this.selected_program.detail_program.splice(this.step_index, 1);
  }

  up_craft(): void{
    // 步骤往上移
    if(this.step_index === 0){
      return
    }
    let pre_index = this.step_index - 1;
    // 交换位置
    [
      this.selected_program.detail_program[this.step_index], 
      this.selected_program.detail_program[pre_index] 
    ] = 
    [
      this.selected_program.detail_program[pre_index], 
      this.selected_program.detail_program[this.step_index] 

    ];
    console.log('up' + this.step_index);

  }

  down_craft(): void{
    // 步骤往下移
    let length = this.selected_program.detail_program.length;  // 获得配方长度
    if(this.step_index === length - 1){
      return
    }
    // 交换位置
    let next_index = this.step_index + 1;
    [
      this.selected_program.detail_program[this.step_index], 
      this.selected_program.detail_program[next_index] 
    ] = 
    [
      this.selected_program.detail_program[next_index], 
      this.selected_program.detail_program[this.step_index] 

    ];
    console.log('down' + this.step_index);

  }
  

}
