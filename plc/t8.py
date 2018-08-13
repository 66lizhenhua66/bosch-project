
import re

import time
import struct
import snap7
from snap7.snap7types import S7AreaDB, S7DataItem

#import ctypes

def get_addr(addr):
    
    if addr.count('DBB'):
        rawstr = r"""DB(\d+)\.DBB(\d+)"""
        compile_obj = re.compile(rawstr)
        match_obj = compile_obj.search(addr)

        # method 2: using search function (w/ external flags)
        #match_obj = re.search(rawstr, matchstr)

        # method 3: using search function (w/ embedded flags)

        if match_obj != None:
            # Retrieve group(s) from match_obj
            all_groups = match_obj.groups()

            # Retrieve group(s) by index
            db_number = int(match_obj.group(1))
            start = int(match_obj.group(2))
            return (db_number, start)
        else:
            raise(Exception)
            
    else:
            
        rawstr = r"""DB(\d+)\.DBX(\d+)\.(\d+)"""

        # method 1: using a compile object
        compile_obj = re.compile(rawstr)
        match_obj = compile_obj.search(addr)

        # method 2: using search function (w/ external flags)
        #match_obj = re.search(rawstr, matchstr)

        # method 3: using search function (w/ embedded flags)

        if match_obj != None:
            # Retrieve group(s) from match_obj
            all_groups = match_obj.groups()

            # Retrieve group(s) by index
            db_number = int(match_obj.group(1))
            start = int(match_obj.group(2))
            bit = int(match_obj.group(3))
            return (db_number, start, bit)
        else:
            print(addr)
            #raise(Exception)

ip = '192.168.100.20'
rack = 0   
slot = 1
tcpport = 102 


client = snap7.client.Client()
client.connect(ip, rack, slot, tcpport)
print(client.get_cpu_state())



s = b'mabo1234'

s = struct.pack('8s','mabotech'.encode('utf8'))
print(s)
rfid_strs = {'rfid_1': 'DB520.DBB200'}
db_number, start = get_addr(rfid_strs['rfid_1'])
print(db_number, start)
result = client.db_read(db_number=db_number, start=start, size=8)
print(result)
time.sleep(0.1)
client.db_write(db_number=db_number, start=start, data=s)
time.sleep(0.1)
result = client.db_read(db_number=db_number, start=start, size=8)
print(result)


client.disconnect()
client.destroy()
