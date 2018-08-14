import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscribable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationLoginService {

  constructor(private $http: HttpClient) { }


  login(card_id: string, station: string): Subscribable<{}> {
    // 登录请求，返回True,写入用户信息
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      '/api/program',
      {
        "method": "station_login",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {"card_id": card_id, "station": station}
      },
      httpOptions,
    );
  }
}
