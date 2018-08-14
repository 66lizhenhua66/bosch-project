import { Injectable } from '@angular/core';
import { Subscribable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProgramUser } from '../program_user';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private api_url = "/api/program"

  constructor(private $http: HttpClient) { }

  get_users(): Subscribable<{}> {
    // 从服务器获取所有用户信息
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "get_users",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {},
      },
      httpOptions,
    );
  }

  save_user(user: ProgramUser, option: string): Subscribable<{}> {
    // 保存用户
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    if (option === 'update') {
      return this.$http.post(
        this.api_url,
        {
          "method": "save_user",
          "jsonrpc": "2.0",
          "id": "0",
          "params": {
            'user_name': user.user, 
            'pw': user.pw, 
            'img_path': user.img_path, 
            'show_name': user.show_name,
            'user_id': user.id
          },
        },
        httpOptions,
      );
    } else {
        return this.$http.post(
          this.api_url,
          {
            "method": "save_user",
            "jsonrpc": "2.0",
            "id": "0",
            "params": {
              'user_name': user.user, 
              'pw': user.pw, 
              'img_path': user.img_path, 
              'show_name': user.show_name,
              'user_id': '',
            },
          },
          httpOptions,
        );

    }
  }
  
  delete_user(user_id: number): Subscribable<{}> {
    // 删除对应ID的用户
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "delete_user",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {'user_id': user_id},
      },
      httpOptions,
    );
    
  }

}
