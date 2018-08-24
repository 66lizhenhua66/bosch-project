import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { ProgramsService } from '../../pages/programs.service';
import { StationsService } from '../stations.service';

import { Program } from '../../pages/program';
import { Auto, Hand } from '../../pages/step';


import { PDFDocumentProxy } from 'pdfjs-dist';
import { Order } from '../../pages/orders/order';

import { LOGIN_STATES } from '../../login_states';

// import { StateMachine } from 'javascript-state-machine';

import { WebsocketService } from './websocket.service';

@Component({
  selector: 'auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.scss']
})
export class AutoComponent implements OnInit {

  private left_page: number = 1;  // 左边pdf的页码
  private left_pages: number = 1;  // 左边pdf的总页码
  private left_zoom: number = 0.6;  // 左边的放大系数
  private right_page: number = 1;  // 右边pdf的页码
  private right_pages: number = 1;  // 右边pdf的总页码
  private right_zoom: number = 0.6;  // 右边的放大系数

  private selected_program: Program;  // 当前工站选择的程序
  private selected_step: Auto | Hand;  // 当前程序的步骤
  private selected_order: Order;
  private current_step_index: number;  // 当前工步
  private temp_count: string = '0';  // 剩余次数, 不更改原来的值，方便重置
  private temp_state: string = '等待';  // 扭矩等的大小
  private temp_okornok: string = '等待';  // 扭矩枪ok or nok
  private torque_time: string = '5';  // 扭矩枪完成等待的时间
  private temp_states: any = [];  // 扭矩枪的结果集

  private selected_programs: Program[];  // 当前工站的所有程序
  private id: number;
  private id_2_station = {
    1: 'ST10',
    2: 'ST20',
    3: 'ST30',
    4: 'ST40',
    5: 'ST50',
    6: 'ST60',
    7: 'ST70',
  };  // 定义返回键的路由

  private login_states: any;

  private all_states: any = {
    'ST10': {'ptl_1': 0, 'ptl_2': 0, 'ptl_3': 0, 'rfid_1': '', 'rfid_2': '', 'next_1': 0},
    'ST20': {'ptl_4': 0, 'ptl_5': 0, 'ptl_6': 0, 'ptl_7': 0, 'ptl_8': 0, 'next_2': 0, 'rfid_3': ''},
    'ST30': {'next_3': 0, },
    'ST40': {'ptl_9': 0, 'ptl_10': 0, 'ptl_11': 0, 'next_4': 0, 'rfid_4': ''},
    'ST50': {'next_5': 0, 'rfid_5': ''},
    'ST60': {'ptl_12': 0, 'ptl_13': 0, 'ptl_14': 0, 'ptl_15': 0, 'ptl_16': 0, 'next_6': 0, 'rfid_6': ''},
    'ST70': {'ptl_17': 0, 'ptl_18': 0, 'ptl_19': 0, 'ptl_20': 0, 'next_7': 0},
  }
  private selected_states: any;
  private ptlpos_2_name: any = {
    'ST10-3': 'ptl_1', 'ST10-2': 'ptl_2', 'ST10-1': 'ptl_3',
    'ST20-5': 'ptl_4', 'ST20-4': 'ptl_5', 'ST20-3': 'ptl_6', 'ST20-2': 'ptl_7', 'ST20-1': 'ptl_8',
    'ST40-3': 'ptl_9', 'ST40-2': 'ptl_10', 'ST40-1': 'ptl_11', 
    'ST60-5': 'ptl_12', 'ST60-4': 'ptl_13', 'ST60-3': 'ptl_14', 'ST60-2': 'ptl_15', 'ST60-1': 'ptl_16',
    'ST70-4': 'ptl_17', 'ST70-3': 'ptl_18', 'ST70-2': 'ptl_19', 'ST70-1': 'ptl_20',
  }

  private sn_queue: Array<{}> = [];  // 序列号的队列
  private complete_sn: Set<string> = new Set();  // 完工的序列号
  private camera_regex: RegExp = /.*拍照.*/;  //匹配当前的步骤是拍照
  private show_photo: boolean = false;  // 是否显示照片
  private show_time: string = '5';  // 显示时间
  private photo_result: boolean = true;  // 拍照结果OK or NOK
  private left_photo: string = '/assets/camera-photoes/1.bmp';  // 左边照片路径
  private right_photo: string = '/assets/camera-photoes/2.bmp';  // 右边照片路径

  private is_complete: boolean = true;  // 判断当前工步是否完成

  // private fsm: StateMachine;  // 构造当前设备的状态机

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private program_serivce: ProgramsService,
    
    private stations_service: StationsService,
    private ws_service: WebsocketService,
  ) { 
    this.selected_program = this.stations_service.get_mock_program();  // 默认的模拟程序
    this.selected_order = this.stations_service.get_mock_order();  // 模拟order数据
    this.current_step_index = 0;
    this.selected_step = this.selected_program.detail_program[this.current_step_index];  // 默认选中程序的第一步
    if(this.selected_step.is_auto) {
      // 如果是自动，则将count赋给temp_count;
      this.temp_count = this.selected_step['count'];
    }

    this.login_states = LOGIN_STATES;

    // 初始化当前状态机
    // this.fsm = {
    //   current:
    // }


  }

  ngOnInit() {
    this.get_id();

    this.router.events
    .filter( (event) => event instanceof NavigationEnd )
    .subscribe( (event: NavigationEnd) => {
      this.get_id();
    });  // 监听url变化

    this.connect();
    
  }

  back_2_index(): void {
    // 返回按钮的点击事件
    this.ws_service.close();
    this.router.navigateByUrl("/stations/" + this.id_2_station[this.id]);
  }

  connect(): void {
    // 连接ws
    this.ws_service.connect("ws://192.168.100.1:5678/" + this.id)
    // this.ws_service.connect("ws://127.0.0.1:5678/" + this.id)
    .subscribe(
      (data) => {
        // 如果是当前工位的，则进行改变状态
        data = eval('(' + data + ')');  // 可以不是规范的json
        if(data["station"] === this.id_2_station[this.id]) {
          console.log(data);
          if(data["type"] === "state") {
            // 改变防错灯状态
            this.change_state(data);
          } else if (data['type'] === 'add_sn') {
            // 添加序列号
            this.add_sn(data);
          } else if (data['type'] === 'photo') {
            // 照相的结果
            this.complete_photo(data);
          } else if (data['type'] === 'torque') {
            // 如果返回的是扭矩枪的结果，则调用对应方法
            this.complete_torque(data);
          } else if (data['type'] === 'press') {
            // 返回压机结果
            

          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  complete_torque(data): void {
    // 接受到扭矩大小的操作
    // recv_data: { "type": "torque", "device": "1", "torque": '50Nm', "angle": '20', "result": 1, "station": "ST40"}
    //    device: 第几个扭矩枪，对应 selected_step.pro_num.split('-')[1],
    //    torque: 扭矩大小，angle: 角度大小，result: ok or nok
    if (this.selected_step.is_auto) {
      // 是自动步骤，才进行操作
      let pro_num_list = this.selected_step['pro_num'].split('-');
      if ((pro_num_list[0] === 'T') && (pro_num_list[1] === data['device'])) {
        // 该步骤为扭矩枪步骤，且设备号相同才进行后续操作
        if (this.temp_count === '0') {
          // 如果该步骤没有剩余拧紧次数了，不进行操作
          return;
        }
        this.temp_state = data['torque'];
        data['result'] ? this.temp_okornok = 'OK' : this.temp_okornok = 'NOK';
        this.temp_states.push({'torque': data['torque'], 'result': data['result']});

        if (data['result']) {
          this.temp_count = (parseInt(this.temp_count) - 1).toString();
          if (this.temp_count === '0') {
            this.torque_time = '5';
            let s = setInterval(() => {
              this.torque_time = (parseInt(this.torque_time) - 1).toString();
            }, 1000)
            setTimeout(() => {
              this.temp_count = '0';
              this.temp_state = '等待';
              this.temp_okornok = '等待';
              this.temp_states = [];
              this.torque_time = '0';
              this.next_or_complete();
              clearInterval(s);

            }, 5000);

          }
        }

      }
    }
  }

  // judge_torque(): boolean {
  //   // 判断扭矩枪步骤是否合格
  //   let ok_count: number = 0;
  //   for (let res of this.temp_states) {
  //     if (res['result']) {
  //       ok_count += 1;
  //     }
  //   }
  //   if (ok_count == this.selected_step['count']) {
  //     return true;
  //   }
  //   return false;
  // }

  complete_photo(recv: any): void {
    // 完成拍照后要进行的步骤
    // recv_data: {
    //      "type": "photo", "left_path": "image_path1", "right_path": "image_path2", 
    //      "result": 1, "station": "ST40"
    // }
    if (this.camera_regex.test(this.selected_step.step_name)) {
      // 如果当前是拍照步骤，才进行操作
      this.left_photo = recv['left_path'];
      this.right_photo = recv['right_path'];
      this.show_photo = true;
      if (recv['result']) {
        this.photo_result = true;
        let s = setInterval(() => {
          // console.log('22222');
          this.show_time = (parseInt(this.show_time) - 1).toString();
        }, 1000);
        setTimeout(() => {
          // console.log('11111');
          clearInterval(s);
          this.show_time = '5';
          this.show_photo = false;
          this.next_or_complete();
        }, 5000);

      } else {
        this.photo_result = false;
      }
    }
  }

  focus_complete(): void {
    // console.log('onnnnnnn');
    this.show_time = '5';
    this.show_photo = false;
    this.next_or_complete();
  }
 

  add_sn(recv_data: any): void {
    // 添加SN序列号到任务队列
    this.sn_queue.push({"sn": recv_data["sn"], "is_download": false});
    // 如果第0个，即当前任务没下载，则
    if(!this.sn_queue[0]["is_download"]) {
      this.get_program(this.sn_queue[0]["sn"]);
    }
    // this.sn_queue.
  }

  get_program(sn: string) {
    // 请求当前sn对应的程序
    this.stations_service.download_data(this.id_2_station[this.id], sn).subscribe(
      (data) => {
        if(data['result']) {
          // console.log('11111');
          // console.log(data);
          this.selected_program = data['result']['selected_program'];
          this.selected_order = data['result']['selected_order'];
          this.current_step_index = 0;
          this.selected_step = this.selected_program.detail_program[this.current_step_index];  // 默认选中程序的第一步
          // console.log(this.selected_order);
          // console.log(this.selected_program);
          if(this.selected_step.is_auto) {
            // 如果是自动，则将count赋给temp_count;
            this.temp_count = this.selected_step['count'];
          }
          this.sn_queue[0]["is_download"] = true;  // 将下载完成的设为true
          this.is_complete = false;
          this.light_ptl();
          this.take_photo();
        }
        else {
          this.sn_queue.splice(0, 1);
          if(this.sn_queue.length > 0) {
            this.get_program(this.sn_queue[0]["sn"]);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  change_state(recv_data: any): void {
    // 改变状态做对应的操作
    // console.log("come in!");
    if(recv_data['device'] === "next") {
      if(this.selected_step.is_auto) {
        // 如果是自动，并是压力机，则可进行下一步
        if(this.selected_step['pro_num'].split('-')[0] === 'P') {
          this.next_or_complete();
        }
      } else {
        // 如果手动，仅仅没有ptl的时候跳下一步
        if(!this.selected_step["is_ptl"]) {
          this.next_or_complete();
        }
      }
    } else if(recv_data['device'] === this.ptlpos_2_name[this.selected_step['ptl_pos']]) {
      if(recv_data['value']) {
        this.selected_states[recv_data['device']] = 1;
      } else {
        if(this.selected_states[recv_data['device']]) {
          this.selected_states[recv_data['device']] = 0;
          this.next_or_complete();
        }

      }
      
    }
    else if((recv_data['device'] === "ptl_1") && (!recv_data['value'])) {

    }
    
  }

  next_or_complete(): void {
    // 判断是完工还是下一步
    // console.log('click..complete');
    if(this.is_complete) {
      return;
    }
    if(this.id_2_station[this.id] == 'ST20' && this.current_step_index == 1) {
      console.log('form ST20.2 to ST20.3')
      this.stations_service.send_complete('ST20', this.sn_queue[0]["sn"]).subscribe(
        (data) => {
          console.log('complete: ', data);
          if(data['result']) {
            console.log('send ST20 complete done!');
          } 
        },
        (err) => {
          console.log(err);
        }
      );
    }
    if(this.current_step_index === this.selected_program.detail_program.length - 1) {
      this.complete();
    } else {
      this.next_step();
    }

  }

  send_message(message: string): void {
    this.ws_service.send(message);
  }

  take_photo(): void {
    // 判断当前步骤是否需要照相，需要则进行上传照相程序
    if (this.selected_step.is_auto) {
      let pro_num_list = this.selected_step['pro_num'].split('-');
      if (pro_num_list[0] === 'C') {
        this.stations_service.upload_camera_num(pro_num_list[2]).subscribe(
          (data) => {
            console.log(data);
            if (data["result"]) {
              console.log("发布拍照完成")
            }
          },
          (err) => {
            console.log(err);
          }
        );

      }

    }
    
  }


  light_ptl(): void {
    // 判断当前步骤是否需要点亮ptl的灯，需要则进行点亮
    if(!this.selected_step.is_auto) {
      if(this.selected_step["is_ptl"]) {
        this.selected_step['ptl_pos'] = this.selected_step['ptl_pos'].trim();  // 去掉空格
        console.log("需要点亮ptl" + this.selected_step['ptl_pos']);
        this.stations_service.send_write_ptl(this.ptlpos_2_name[this.selected_step['ptl_pos']], 1).subscribe(
          (data) => {
            console.log('light success');
            console.log(data)
          },
          (err) => {
            console.log('light fail!');
            console.log(err);
          }

        );

      }
    }
  }



  get_id(): void {
    try {
      this.id =  parseInt(this.route.snapshot.paramMap.get('id'));
      if( ! (this.id in this.id_2_station) ) {
        this.id = 1
      }
    } catch(e) {
      console.log(e);
      this.id = 1
    }
    this.selected_states = this.all_states[this.id_2_station[this.id]];  // 选中当前的状态机

    
  }

  refresh(): void {
    // 刷新当前界面
    LOGIN_STATES.img_path = '';
    LOGIN_STATES.program_user = '';
    LOGIN_STATES.station_user = '';
    LOGIN_STATES.user_number = '';
    this.router.navigateByUrl("/login/station/" + this.id);
  }

  next_step(): void {
    // 点击下一步
    // console.log("dianji xiayibu");
    this.current_step_index + 1 > this.selected_program.detail_program.length ?
     this.current_step_index = this.selected_program.detail_program.length :
     this.current_step_index ++;
    this.selected_step = this.selected_program.detail_program[this.current_step_index];
    if(this.selected_step.is_auto) {
      // 如果是自动，则将count赋给temp_count;
      this.temp_count = this.selected_step['count'];
    }
    this.light_ptl();
    this.take_photo();

  }

  complete(): void {
    // 完工
    this.is_complete = true;
    // this.complete_sn.add(this.sn_queue[0]["sn"]);
    if(this.id_2_station[this.id] == 'ST10' || this.id_2_station[this.id] == 'ST30') {
        this.sn_queue.splice(0, 1);
        if(this.sn_queue.length > 0) {
          this.get_program(this.sn_queue[0]["sn"]);
        }
        return
    }
    let complete_station = '';
    if (this.id_2_station[this.id] == 'ST20'){
      complete_station = 'ST30'
    } else {
      complete_station = this.id_2_station[this.id];
    }
    this.stations_service.send_complete(complete_station, this.sn_queue[0]["sn"]).subscribe(
      (data) => {
        console.log('complete: ', data);
        if(data['result']) {
          this.sn_queue.splice(0, 1);
          if(this.sn_queue.length > 0) {
            this.get_program(this.sn_queue[0]["sn"]);
          }
        } 
      },
      (err) => {
        console.log(err);
      }
    );
  }

  reset_step(): void {
    // 重置当前工步
    // for(let temp in array){} 迭代的是array的键
    for(let key in this.selected_states) {
      if(this.selected_states[key]) {
        console.log("关闭当前亮的：" + key);
        this.selected_states[key] = 0;
        this.stations_service.send_write_ptl(key, 0).subscribe(
          (data) => {
            console.log('close ok!');
            console.log(data);
          }, 
          (err) => {
            console.log(err);
          }
        );
      }
    }
    this.show_time = '5';
    this.show_photo = false;
    this.current_step_index = 0;
    this.selected_step = this.selected_program.detail_program[this.current_step_index];

    // 初始化temp的变量
    this.temp_count = '0';
    this.temp_state = '等待';
    this.temp_okornok = '等待';
    this.temp_states = [];

    if(this.selected_step.is_auto) {
      // 如果是自动，则将count赋给temp_count;
      this.temp_count = this.selected_step['count'];
    }
    this.light_ptl();
    this.take_photo();
  }

  // pdf的功能函数
  load_left_pdf_done(load_pdf: PDFDocumentProxy) {
    // 加载完成pdf文件后的回调函数
    this.left_pages = load_pdf.numPages;
  }
  left_next_page(): void {
    // 左边下一页翻页
    this.left_page + 1 > this.left_pages ? this.left_page = this.left_pages : this.left_page++;
  }
  left_prev_page(): void {
    // 左边上一页翻页
    this.left_page - 1 < 1 ? this.left_page = 1 : this.left_page--;
  }

  left_zoom_up(): void {
    // 昨天放大系数增加
    if(this.left_zoom > 0.9) {
      return
    }
    this.left_zoom += 0.1;
    console.log(this.left_zoom);
  }

  left_zoom_down(): void {
    // 左边放大系数减小
    if(this.left_zoom < 0.7) {
      return
    }
    this.left_zoom -= 0.1;
  }

  load_right_pdf_done(load_pdf: PDFDocumentProxy) {
    // 加载完成pdf文件后的回调函数
    this.right_pages = load_pdf.numPages;
  }
  right_next_page(): void {
    // 右边下一页翻页
    this.right_page + 1 > this.right_pages ? this.right_page = this.right_pages : this.right_page++;
  }
  right_prev_page(): void {
    // 右边上一页翻页
    this.right_page - 1 < 1 ? this.right_page = 1 : this.right_page--;
  }

  right_zoom_up(): void {
    // 昨天放大系数增加
    if(this.right_zoom > 0.9) {
      return
    }
    this.right_zoom += 0.1;
  }

  right_zoom_down(): void {
    // 左边放大系数减小
    if(this.right_zoom < 0.7) {
      return
    }
    this.right_zoom -= 0.1;
  }



}
