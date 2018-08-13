# hello.py

import time
import curio
#import signal
import threading

reconn_plc_evt = curio.Event()
reconn_redis_evt = curio.Event()


q = curio.UniversalQueue()

async def heartbeat():
    while True:
        print('timer')
        await curio.sleep(5)
        await q.put('heartbeat')
        
class Engine(object):
    
    def __init__(self, config):
        self.config = config
        
    async def reconnect_plc(self):
        while True:
            
            ### add and release lock
            print('reconnect plc here')
            #print(dir(start_evt))
            await reconn_plc_evt.wait()
            reconn_plc_evt.clear()

    async def reconnect_redis(self):
        while True:
            ### add and release lock
            print('>>>>>>>>>>reconnect redis here')
            #print(dir(start_evt))
            await reconn_redis_evt.wait()
            reconn_redis_evt.clear()



            
    async def publisher_loop(self):
        while True:
            
            msg = await q.get()
            print(f'>publish [{msg}] to redis here')        
            #redis puslish
            
            
    async def reader_loop(self):
        n = 0
        while True:
            n += 1
            try:
                print('read area from plc here,', n)
                await q.put(n)
                await curio.sleep(1)
                #n -= 1
            except curio.CancelledError:
                print('next r')
                #raise        

    async def writer_loop(self):
        n = 0
        while True:
            n += 1
            try:
                print('write to plc here', n)
                await curio.sleep(1)
                if n % 4 == 0:
                    await reconn_redis_evt.set()
                #n -= 1
            except curio.CancelledError:
                print('next w')
                #raise            



    def fib(self, n):
        """put in thread"""
        time.sleep(1)
        print('>test:', n,'-',threading.current_thread())
        if n <= 2:
            return 1
        else:
            return fib(n-1) + fib(n-2)

async def tasks():
    """"""
    #await curio.timeout_after(1, start_evt.wait)
    #except curio.TaskTimeout:
    config = {}
    eng = Engine(config)
    
    await curio.spawn(heartbeat)
    #print('Building the Millenium Falcon in Minecraft')
    async with curio.TaskGroup() as f:
        
        await f.spawn(eng.reconnect_plc)
        await f.spawn(eng.reconnect_redis)
        
        await f.spawn(eng.reader_loop)
        await f.spawn(eng.writer_loop)
        await f.spawn(eng.publisher_loop)
        
        try:
            total = 0
            for n in range(6):
                #fib(3)
                total += await curio.run_in_thread(eng.fib, 3)
                print('demo event: reconnect redis here')
                
                
        except curio.CancelledError:
            print('Fine. Saving my work.')
            #raise
        except:
            print('reconnect redis here')
            await reconn_redis_evt.set()

async def main():
    #goodbye = curio.SignalEvent(signal.SIGINT)

    task_co = await curio.spawn(tasks)
    await task_co.join()


if __name__ == '__main__':
    curio.run(main, with_monitor=True)