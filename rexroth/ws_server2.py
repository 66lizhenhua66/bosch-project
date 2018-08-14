# -*- coding: utf-8 -*-
import asyncio
import websockets
import asyncio_redis


async def handler(websocket, path):
    """
    websockets handler
    
    """
    print('有新连接')
    print("订阅对应工站的数据")
    print(path)
    rd = await asyncio_redis.Connection.create(host="127.0.0.1", port=6379)
    sub = await rd.start_subscribe()
    await sub.subscribe(["A10_EVENT", "A10_SN"])
    while True:
        data = await sub.next_published()
        print(path, data.value)
        try:
            await websocket.send(data.value)
        except Exception as ex:
            print(path, ex)
            rd.close()
            websocket.close()
            break


def recv_message(websocket, ):
    """接受信息并发布指令线程"""
    print("开始接受信息。。")
    print(dir(websocket))
    while True:
        print('----')
        print(websocket.messages.get())
        print('=====')
        data = ''
        if not data:
            break
        print("收到信息：---->>{}<<<<----".format(data))
    websocket.close()


def main():
    # 启动websocket服务器
    start_server = websockets.serve(handler, '0.0.0.0', 5678)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()

