import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Program } from './program';
import { PROGRAMS } from './mock-programs';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  private programs: Program[];  // 所有的程序
  // private selected_station: Program[];  // 当前选中工作站的所有程序
  private api_url: string = "/api/program";  // 保存的url

  constructor(private $http: HttpClient) {
    this.programs = PROGRAMS;
  }

  get_programs(): Program[] {
    return this.programs;
  }

  download_programs(): Observable<{}> {
    // 获得所有的程序
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "get_programs",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {},
      },
      httpOptions,
    );
  }

  get_programs_by_station(station: string): Program[] { 
    // 获得指定工作站的所有程序
    let temp_programs: Program[] = [];
    for(let i=0; i<this.programs.length; i++) {
      if(this.programs[i].station === station) {
        temp_programs.push(this.programs[i]);
      }
    }
    return temp_programs;
  }

  update(programs: Program[]) {
    // 更新程序, 往服务器发送数据
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "save_programs",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {
          "programs": programs, 
        },
      },
      httpOptions,
    );
  }
  rename(old_number: string, new_number: string) {
    // 重命名程序
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "rename_program",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {
          "old_number": old_number, 
          "new_number": new_number,
        },
      },
      httpOptions,
    );
    

  }
  
  add_new_program(program: Program): void {
    // 添加一个新的程序到当前工作站
    
  }


}
