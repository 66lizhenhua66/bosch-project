import { Injectable } from '@angular/core';

import { StationUser } from '../station_user';
import { Subscribable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private api_url: string = '/api/program';
  
  constructor(private $http: HttpClient) { }

  get_station_users(): Subscribable<{}> {
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
        "method": "get_station_users",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {},
      },
      httpOptions,
    );
  }

  save_station_user(station_user: StationUser): Subscribable<{}> {
    // 更新员工信息
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "save_station_user",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {
          "card_id": station_user.card_id,
          "user_number": station_user.user_number,
          "name": station_user.name,
          "img_path": station_user.img_path,
          "authority": station_user.authority,
        },
      },
      httpOptions,
    );
  }
  
  delete_station_user(card_id: string): Subscribable<{}> {
    // 删除员工信息
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": "Basic bWFibzptYWJv",
        })
      };
      return this.$http.post(
        this.api_url,
        {
          "method": "delete_station_user",
          "jsonrpc": "2.0",
          "id": "0",
          "params": {
            "card_id": card_id,
          },
        },
        httpOptions,
      );

  }

}
