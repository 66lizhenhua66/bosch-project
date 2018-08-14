import { Injectable } from '@angular/core';

import { Program } from '../pages/program';
import { Order } from '../pages/orders/order';

import { PROGRAM } from './mock-program';
import { ORDER } from './mock-order';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscribable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  private api_url: string = '/api/program';
  private program: Program;
  private order: Order;

  constructor(private $http: HttpClient) { 
    this.program = PROGRAM;
    this.order = ORDER;
  }

  get_mock_program(): Program {
    return this.program;
  }

  get_mock_order(): Order {
    return this.order;
  }

  download_data(station_name: string, sn_number: string): Subscribable<{}> {
    // 从服务器下载对应的程序跟订单
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "get_station_data",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {"station_name": station_name, "sn_number": sn_number},
      },
      httpOptions,
    );

  }

  send_complete(station_name: string, sn_number: string): Subscribable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "complete",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {"station_name": station_name, "sn_number": sn_number},
      },
      httpOptions,
    );
  }
  send_write_ptl(ptl_number: string, val: number): Subscribable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "write_ptl",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {"ptl_number": ptl_number, "val": val},
      },
      httpOptions,
    );
  }

  upload_camera_num(camera_num: string): Subscribable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "take_photo",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {"camera_num": camera_num},
      },
      httpOptions,
    );
  }



}
