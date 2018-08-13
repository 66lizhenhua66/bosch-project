
import time
import struct
import snap7
from snap7.snap7types import S7AreaDB, S7DataItem

#import ctypes


ip = '127.0.0.1'   
rack = 0   
slot = 1
tcpport = 102 


client = snap7.client.Client()
client.connect(ip, rack, slot, tcpport)
print(client.get_cpu_state())
#print(dir(client))

#print(client.list_blocks())

#client.db_get(db_number=540)



t1 = time.time()
#for i in range(0,10):
result = client.db_read(db_number=3, start=0, size=10)
print(time.time() - t1)
print(result)

v = struct.pack('ci', b'*', 0x12131415)
v = struct.pack('llh0l', 6, 6, 6)


time.sleep(0.005)
#result = client.as_db_write(db_number=3, start=0, data=v)
print(result)
time.sleep(0.003)
#Bit = false


"""
    # add in snap7.client.py
    def write_bit(self, area, dbnumber, byte, bit, value):
        wordlen = snap7.snap7types.S7WLBit
        start = byte * 8 + bit
        return self.library.Cli_WriteArea(self.pointer, area, dbnumber, start, 1, wordlen, value)

"""

def set_bit():
    reading = client.db_read(db_number=3, start=3, size=1)    # read 1 byte from db 31 staring from byte 120
    print('reading:',reading)
    snap7.util.set_bool(reading, 0, 2, 0)   # set a value of fifth bit
    print(reading)
    
    time.sleep(0.003)
    result = client.db_write(3, 3, reading)    # write back the bytearray and now the boolean value is change
print(result)

#data_items = (S7DataItem * 1)()
data_items = (S7DataItem * 1)()
data_items[0].Area = 1#ctypes.c_int32(S7AreaDB)
print(data_items)

result = client.write_bit(S7AreaDB, 3, 3, 4, data_items)
if result != 0:
    #raise(Exception('write bit failed'))
    pass
print('write_bit_in_byte:',result)
time.sleep(0.003)
result = client.db_read(db_number=3, start=3, size=1)

print(result)
c = struct.unpack('@16?', result)
print(c)

result = client.read_area(S7AreaDB, dbnumber=3, start=0, size=10)
print(result)
print('ok')
client.disconnect()
client.destroy()
