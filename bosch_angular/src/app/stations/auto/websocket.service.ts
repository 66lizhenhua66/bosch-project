import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  ws: WebSocket;  // 该站与主站建立的websocket
  private heartBeat: any;  // 心跳定时器

  constructor() { }

  connect(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    Observable.create()
    return new Observable(
      observer => {
        this.ws.onopen = (event) => this.setHeartBeat(event);
        this.ws.onmessage = (event) => observer.next(event.data);
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
      }
    )
  }

  close(): void {
    // 关闭ws
    this.ws.close();

  }

  setHeartBeat(event: any): void {
    // 设置心跳重连机制
    if (this.heartBeat) {
      console.log('clear!');
      clearInterval(this.heartBeat);
    }
    // this.heartBeat = setInterval(() => {
    //   try:
    //     this.send('ping');
    //   catch
    // }, 1000);

  }

  send(message: string) {
    this.ws.send(message);
  }

}
