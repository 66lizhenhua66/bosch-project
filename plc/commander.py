import json
import time
import traceback

import redis

from plc import PlcWriter

from utils import get_addr


class Writer(object):

    def __init__(self):

        self.redis_host = 'localhost'

        self.db_number = 540  # start,bit,val

        self.plc_writer = PlcWriter()

        self.red = redis.Redis(host=self.redis_host, db=0)

        self.ps = self.red.pubsub()

        self.ps.subscribe(['START', 'mabo'])

        self.ptl_address = {'ptl_1': 'DB540.DBX258.0', 'ptl_2': 'DB540.DBX258.1', 'ptl_3': 'DB540.DBX258.2',
                            'ptl_4': 'DB540.DBX258.3', 'ptl_5': 'DB540.DBX258.4', 'ptl_6': 'DB540.DBX258.5',
                            'ptl_7': 'DB540.DBX258.6', 'ptl_8': 'DB540.DBX258.7', 'ptl_9': 'DB540.DBX888.0',
                            'ptl_10': 'DB540.DBX888.1', 'ptl_11': 'DB540.DBX888.2', 'ptl_12': 'DB540.DBX1098.0',
                            'ptl_13': 'DB540.DBX1098.1', 'ptl_14': 'DB540.DBX1098.2', 'ptl_15': 'DB540.DBX1098.3',
                            'ptl_16': 'DB540.DBX1098.4', 'ptl_17': 'DB540.DBX1098.5', 'ptl_18': 'DB540.DBX1098.6',
                            'ptl_19': 'DB540.DBX1098.7', 'ptl_20': 'DB540.DBX1099.0'}

        self.st_done = {'st10_done': 'DB540.DBX7.4', 'st20_done': 'DB540.DBX7.5', 'st30_done': 'DB540.DBX7.6',
                        'st40_done': 'DB540.DBX7.7', 'st50_done': 'DB540.DBX8.0', 'st60_done': 'DB540.DBX8.1',
                        'st70_done': 'DB540.DBX8.2'}

        self.station_2_st_done = {'ST10': 'st10_done', 'ST20': 'st20_done', 'ST30': 'st30_done',
                                  'ST40': 'st40_done', 'ST50': 'st50_done', 'ST60': 'st60_done',
                                  'ST70': 'st70_done'}

        self.camera_done = {'camera_done': 'DB540.DBX5.3'}

        self.option_methods = {
            "write_ptl": self.write_ptl, "write_sn": self.write_rfid,
            "write_complete": self.write_complete, "write_ptl_by_str": self.write_ptl_by_str,
            'write_camera_done': self.write_camera_done,

       }

    def write_camera_done(self, val=0):
        db_number, start, bit = get_addr(self.camera_done['camera_done'])
        return self.plc_writer.write_bit(db_number, start, bit, val)

    def write_rfid(self, db_number, start, sn):
        """
        method:write_rfid, params:,station
        """
        return self.plc_writer.write_sn(db_number, start, sn)

    def write_ptl_by_str(self, ptl_and_val_str):
        """
        ptl_and_val_str:  "ptl_1,1"
        :param ptl_and_val_str:
        :return:
        """
        ptl_number, val = ptl_and_val_str.split(",")
        val = int(val)
        self.write_ptl(ptl_number, val=val)

    def write_ptl(self, ptl_number, val=1):
        """
        method:write_ptl, params:ptl_1,ptl_2, station
        """
        db_number, start, bit = get_addr(self.ptl_address[ptl_number])
        # db_number,start,bit,val
        res = self.plc_writer.write_bit(db_number, start, bit, val)
        return res

    def write_complete(self, station, val=1):
        """
        method:complate, parmas:ST10
        """
        db_number, start, bit = get_addr(self.st_done[self.station_2_st_done[station]])
        res = self.plc_writer.write_bit(db_number, start, bit, val)
        return res

    def test(self):

        val = 0

        for ptl_name in self.ptl_address:
            db_number, start, bit = get_addr(self.ptl_address[ptl_name])
            # db_number,start,bit,val
            self.plc_writer.write_bit(db_number, start, bit, val)
            time.sleep(0.1)

    def timer(self):

        while True:
            try:
                self.red.publish('mabo', 'timer')
            except Exception as ex:
                print(ex)
            time.sleep(3)

    def run(self):

        while True:

            try:
                for item in self.ps.listen():
                    print(item)
                    if item['type'] == 'message':
                        option_key = int(item['data'])
                        # print(option_key)
                        task_str = self.red.hget("option_hashes", option_key).decode()
                        task = json.loads(task_str)
                        print("run :", task['method'], 'params: ', task['params'])
                        self.option_methods[task['method']](task['params'])

            except Exception as ex:
                print(ex)
                print(traceback.print_exc)


def main():
    w = Writer()
    w.write_ptl('ptl_1', val=0)
    # w.test()


if __name__ == '__main__':
    main()
