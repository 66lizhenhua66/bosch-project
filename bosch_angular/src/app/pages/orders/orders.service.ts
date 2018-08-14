import { Injectable } from '@angular/core';
import { ORDERS, PROGRAM_NUMBERS } from './mock-orders';
import { Order } from './order';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscribable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private orders: Order[];
  private program_numbers: string[];
  private api_url: string = "/api/program";

  constructor(private $http: HttpClient) { 
    this.orders = ORDERS;
    this.program_numbers = PROGRAM_NUMBERS;
  }

  get_mock_pNumbers(): string[] {
    // 获得模拟的所有程序号
    return this.program_numbers;
  }

  get_mock_orders(): Order[] {
    // 获得模拟的orders
    return this.orders;
  }

  download_orders(): Subscribable<{}> {
    // 下载当天所有订单
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "get_orders",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {},
      },
      httpOptions,
    );

  }

  download_pNumbers(): Subscribable<{}> {
    // 下载所有程序号
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "get_all_pNumbers",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {},
      },
      httpOptions,
    );
  }

  publish_orders(orders: Order[]): Subscribable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
      })
    };
    return this.$http.post(
      this.api_url,
      {
        "method": "publish_orders",
        "jsonrpc": "2.0",
        "id": "0",
        "params": {"orders": orders},
      },
      httpOptions,
    );


  }

}
