# -*- coding:utf-8 -*-
import asyncio


async def hello():
    print("hello world")
    r = await asyncio.sleep(1)
    print('hello world again')


# 获取event loop
loop = asyncio.get_event_loop()
# 执行coroutine
loop.run_forever()
print('aaa')
loop.close()









