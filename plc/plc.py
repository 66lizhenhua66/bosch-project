import time

import snap7
from snap7.snap7types import S7AreaDB, S7DataItem



class PLC(object):

    def __init__(self):
        pass

    def _connect(self):
        ip = '192.168.100.20'
        # ip = '127.0.0.1'
        rack = 0
        slot = 1
        tcpport = 102 


        self.client = snap7.client.Client()
        self.client.connect(ip, rack, slot, tcpport)
        print(self.client.get_cpu_state())
        
    def write_bit(self, db_number, start, bit, val):
        """
        if type(val) != bool:
            raise(Exception('error'))
        #print(data_items)
        if val == True:
            val = 1
        else:
            val = 0
        """
        data_items = (S7DataItem * 1)()
        data_items[0].Area = val  # ctypes.c_int32(S7AreaDB)
        result = self.client.write_bit(S7AreaDB, db_number, start, bit, data_items)
        # result = self.client.write_bit(S7AreaDB, db_number, start, bit, val)
        if result != 0:
            raise(Exception('write bit failed'))
            pass
        return result

    def write_sn(self, db_number, start, sn):
        result = self.client.db_write(db_number=db_number, start=start, data=sn)
        print("write ok")
        return result

        
class PlcWriter(PLC):
    
    def __init__(self):
        self._connect()
        
    def write(self):
        pass

    def write_bit1(self):
        pass
        
    def run(self):
        pass        

        
class PlcReader(PLC):
    
    def __init__(self):
        
        self._connect()
        
    def init(self):
        pass

    def read(self, db_number, start, size):
        result = self.client.db_read(db_number=db_number, start=start, size=size)
        return result
        
    def _parse_data(self):
        pass
        
    def run(self):
        while True:
            time.sleep(0.1)
            
            
def test():
    plc = PlcReader()
    v = plc.read(540, 0, 100)
    print(v)
    
if __name__ == '__main__':
    test()