# -*- coding: utf-8 -*-
"""
circuits
trio
"""

import time
import struct
import traceback
import threading
import queue
import json

import redis

from plc import PlcReader
from utils import get_addr

from commander import Writer


# asyncio_redis.Connection.create(host='127.0.0.1')

def get_bit_value(_bytearray, byte_index, bool_index):
    """
    Get the boolean value from location in bytearray
    """
    index_value = 1 << bool_index
    byte_value = _bytearray[byte_index]
    current_value = byte_value & index_value
    return current_value == index_value


def get_bytes(_bytearray, byte_index, size):
    bytes = []
    for i in range(0, size):
        byte_value = _bytearray[byte_index + i]
        bytes.append(byte_value)
    return bytes


class Checker(object):

    def __init__(self, checker_writer):
        self.checker_writer = checker_writer  # get writer

        self.redis_host = '127.0.0.1'

        self.db_number = 540

        self.red = redis.StrictRedis(host=self.redis_host, port=6379, db=0)

        self.reader = PlcReader()

        self.interval = 0.5

        self.ch = 'channel.st10.part1'

        self.station_val = {self.ch: None}
        self.event_queue = queue.Queue()

        self.device_2_station = {
            'ptl_1': "ST10", 'ptl_2': "ST10", 'ptl_3': "ST10", 'next_1': 'ST10', 'rfid_1': 'ST10', 'rfid_2': 'ST10',
            'ptl_4': "ST20", 'ptl_5': "ST20", 'ptl_6': 'ST20', 'ptl_7': 'ST20', 'ptl_8': 'ST20', 'next_2': 'ST20',
            'rfid_3': 'ST20',
            'next_3': 'ST30',
            'ptl_9': 'ST40', 'ptl_10': 'ST40', 'ptl_11': 'ST40', 'next_4': 'ST40',
            'rfid_4': 'ST40',
            'next_5': 'ST50', 'rfid_5': 'ST50',
            'ptl_12': 'ST60', 'ptl_13': 'ST60', 'ptl_14': 'ST60', 'ptl_15': 'ST60', 'ptl_16': 'ST60', 'next_6': 'ST60',
            'rfid_6': 'ST60',
            'ptl_17': 'ST70', 'ptl_18': 'ST70', 'ptl_19': 'ST70', 'ptl_20': 'ST70', 'next_7': 'ST70',
        }

        self.ptl_done = {'ptl_1': 'DB540.DBX256.0', 'ptl_2': 'DB540.DBX256.1', 'ptl_3': 'DB540.DBX256.2',
                         'ptl_4': 'DB540.DBX256.3', 'ptl_5': 'DB540.DBX256.4', 'ptl_6': 'DB540.DBX256.5',
                         'ptl_7': 'DB540.DBX256.6', 'ptl_8': 'DB540.DBX256.7', 'ptl_9': 'DB540.DBX886.0',
                         'ptl_10': 'DB540.DBX886.1', 'ptl_11': 'DB540.DBX886.2', 'ptl_12': 'DB540.DBX1096.0',
                         'ptl_13': 'DB540.DBX1096.1', 'ptl_14': 'DB540.DBX1096.2', 'ptl_15': 'DB540.DBX1096.3',
                         'ptl_16': 'DB540.DBX1096.4', 'ptl_17': 'DB540.DBX1096.5', 'ptl_18': 'DB540.DBX1096.6',
                         'ptl_19': 'DB540.DBX1096.7', 'ptl_20': 'DB540.DBX1097.0'}

        self.next_cfm = {'next_1': 'DB540.DBX54.4', 'next_2': 'DB540.DBX264.4', 'next_3': 'DB540.DBX474.4',
                       'next_4': 'DB540.DBX684.4', 'next_5': 'DB540.DBX894.4', 'next_6': 'DB540.DBX1104.4',
                       'next_7': 'DB540.DBX1314.4'}

        self.ptl = {
            'ptl_1': 'DB540.DBX258.0', 'ptl_2': 'DB540.DBX258.1', 'ptl_3': 'DB540.DBX258.2', 'ptl_4': 'DB540.DBX258.3',
            'ptl_5': 'DB540.DBX258.4', 'ptl_6': 'DB540.DBX258.5', 'ptl_7': 'DB540.DBX258.6', 'ptl_8': 'DB540.DBX258.7',
            'ptl_9': 'DB540.DBX888.0', 'ptl_10': 'DB540.DBX888.1', 'ptl_11': 'DB540.DBX888.2',
            'ptl_12': 'DB540.DBX1098.0', 'ptl_13': 'DB540.DBX1098.1', 'ptl_14': 'DB540.DBX1098.2',
            'ptl_15': 'DB540.DBX1098.3', 'ptl_16': 'DB540.DBX1098.4', 'ptl_17': 'DB540.DBX1098.5',
            'ptl_18': 'DB540.DBX1098.6', 'ptl_19': 'DB540.DBX1098.7', 'ptl_20': 'DB540.DBX1099.0',
        }
        self.st_done = {'st10_done': 'DB540.DBX7.4', 'st20_done': 'DB540.DBX7.5', 'st30_done': 'DB540.DBX7.6',
                        'st40_done': 'DB540.DBX7.7', 'st50_done': 'DB540.DBX8.0', 'st60_done': 'DB540.DBX8.1',
                        'st70_done': 'DB540.DBX8.2'}
        self.st_done_test = {'st10_done': 'DB540.DBX7.4'}
        self.states = {
            'ptl_1': 0, 'ptl_2': 0, 'ptl_3': 0, 'ptl_4': 0, 'ptl_5': 0, 'ptl_6': 0, 'ptl_7': 0, 'ptl_8': 0,
            'ptl_9': 0, 'ptl_10': 0, 'ptl_11': 0, 'ptl_12': 0, 'ptl_13': 0, 'ptl_14': 0, 'ptl_15': 0, 'ptl_16': 0,
            'ptl_17': 0, 'ptl_18': 0, 'ptl_19': 0, 'ptl_20': 0, 'next_1': 0, 'next_2': 0, 'next_3': 0, 'next_4': 0,
            'next_5': 0, 'next_6': 0, 'next_7': 0,
            'camera_start': 0,
        }

        self.rfid_cfm = {
            'rfid_1': 'DB540.DBX14.0',
            # 'rfid_2': 'DB540.DBX14.1',
            # 'rfid_3': 'DB540.DBX14.2',
            # 'rfid_4': 'DB540.DBX14.3',
            # 'rfid_5': 'DB540.DBX14.4',
            'rfid_6': 'DB540.DBX14.5',
            # 'rfid_7': 'DB540.DBX14.6',
        }
        self.rfid_str = {
            'rfid_1': 'DB520.DBB0',
            'rfid_2': 'DB520.DBB100',
            'rfid_3': 'DB520.DBB200',
            'rfid_4': 'DB520.DBB300',
            'rfid_5': 'DB520.DBB400',
            'rfid_6': 'DB520.DBB500',
            # 'rfid_7': 'DB520.DBB2400',
        }
        self.camera = {'camera_start': "DB540.DBX5.2"}
        self.camera_done = {'camera_done': 'DB540.DBX5.3'}

        # self.test_addr = {'ptl_1': 'DB540.DBX258.0', 'ptl_2': 'DB540.DBX258.1', 'ptl_3': 'DB540.DBX258.2',
        #                   'next_1': 'DB540.DBX54.4', }
        # self.test_addr2 = {'ptl_1': 'DB540.DBX256.0', 'ptl_2': 'DB540.DBX256.1', 'ptl_3': 'DB540.DBX256.2'}

    def write_rfid(self):
        
        sn = struct.pack('8s', 'mabotech'.encode('utf8'))
        
        db_number, start = get_addr(self.rfid_str['rfid_1'])
        print(db_number, start)
        result = self.checker_writer.write_rfid(db_number, start, sn)
        print(result)
        input()
        res = self.checker_writer.write_complete('ST10')
        print('write complete: ', res)
        # input()
        # self.read_rfid()

    def read_rfid(self):
        # db_number, start  = get_addr(self.rfid_str['rfid_6'])
        # print(db_number, start)
        # result = self.reader.read(db_number=db_number, start=start, size=8)
        # print(result)

        # read rfid_sn
        for item in self.rfid_str:
            db_number, start = get_addr(self.rfid_str[item])
            print(db_number, start)
            result = self.reader.read(db_number=db_number, start=start, size=8)
            print(item, result)

        # read st_done state
        # db_value = self.reader.read(540, 0, 300)
        # for item in self.camera:
        #     db_number, start, bit = get_addr(self.camera[item])
        #     print(db_number, start, bit)
        #     b = get_bit_value(db_value, start, bit)
        #     b = 1 if b else 0
        #     print(b)
        #     if self.states[item] != b:
        #         if b:
        #             print("0 ------>>>>  1")
        #             self.event_queue.put({'type': 'camera'})
        #         else:
        #             print("1 ------>>>>   0")
        #             print('wirte camera_done to 0')
        #             res = self.checker_writer.write_camera_done(val=0)
        #             print(res)
        #         self.states[item] = b

    def write_done(self, val=0):
        db_number, start, bit = get_addr(self.camera_done['camera_done'])
        res = self.checker_writer.plc_writer.write_bit(db_number, start, bit, val)
        print(res)

    def test(self):
        # self.write_rfid()
        self.read_rfid()
        # res = self.checker_writer.write_complete('ST60')
        # print(res)
        # while True:
        #     db_value = self.reader.read(540, 0, 300)
        #     db_number, start, bit = get_addr("DB540.DBX7.4")
        #     b = get_bit_value(db_value, start, bit)
        #     print(b)
        #     time.sleep(0.5)

    def get_states(self):
        """get redis states"""
        states = self.red.hgetall("states")
        new_states = dict()
        for k, v in states.items():
            new_states[k.decode()] = v.decode()
        return new_states

    def test_ptl_done(self):
        print('open ptl_1')
        self.checker_writer.write_ptl('ptl_1')
        print('oepned ptl_1 done')
        addr = self.test_addr2['ptl_1']
        db_number, start, bit = get_addr(addr)
        while True:
            db_value = self.reader.read(540, 0, 300)
            print(db_number, start, bit)
            print('get ptl_done_1 status', end=":  ")
            b = get_bit_value(db_value, start, bit)
            print(b)
            if b:
                print('True-------')
                self.checker_writer.write_ptl('ptl_1', val=0)
                time.sleep(0.5)
                db_value = self.reader.read(540, 0, 300)
                print('ptl_1_done', db_number, start, bit, end="===")
                b = get_bit_value(db_value, start, bit)
                print(b)
                break
            time.sleep(1)
        print('done!')

    def publish_event(self):
        while True:
            data = self.event_queue.get()
            data = json.loads(data)
            if data['type'] == 'camera':
                camera_num = self.red.get('camera_num').decode()
                self.red.publish("CAMERA", camera_num)
            else:
                self.red.publish('A10_EVENT', data)

    def test1(self):
        # states = self.get_states()
        self.checker_writer.write_camera_done(1)
        time.sleep(0.5)
        self.checker_writer.write_camera_done()
        while True:
            db_value = self.reader.read(540, 0, 1400)
            # 遍历灯的状态
            for item in self.ptl.keys():
                addr = self.ptl[item]
                db_number, start, bit = get_addr(addr)
                b = get_bit_value(db_value, start, bit)
                b = 1 if b else 0
                if self.states[item] != b:
                    # self.red.hset('states', item, b)
                    self.states[item] = b
                    print('fabuzhuangtai.................', item)
                    data = '{"type": "state", "device": "%s", "value": %d, "station": "%s"}' % (item, b, self.device_2_station[item])
                    # self.red.publish('A10_EVENT', data)
                    self.event_queue.put(data)

            # 遍历取料的状态
            for item in self.ptl_done.keys():
                addr = self.ptl_done[item]
                db_number, start, bit = get_addr(addr)
                b = get_bit_value(db_value, start, bit)
                if b:
                    # 1. close ptl
                    self.checker_writer.write_ptl(item, val=0)
                    # 2. reset ptl_done = 0

            # 遍历下一步按钮的状态
            for item in self.next_cfm:
                addr = self.next_cfm[item]
                db_number, start, bit = get_addr(addr)
                b = get_bit_value(db_value, start, bit)
                b = 1 if b else 0
                if self.states[item] != b:
                    if not b:
                        data = '{"type": "state", "device": "next", "value": 1, "station": "%s"}' % self.device_2_station[item]
                        self.event_queue.put(data)
                        print("按下下一步： ", item)
                    self.states[item] = b

            # 遍历相机按下状态
            for item in self.camera:
                db_number, start, bit = get_addr(self.camera[item])
                # print(db_number, start, bit)
                b = get_bit_value(db_value, start, bit)
                b = 1 if b else 0
                if self.states[item] != b:
                    if b:
                        print("进行拍照")
                        self.event_queue.put('{"type": "camera"}')
                    else:
                        print('wirte camera_done to 0')
                        self.checker_writer.write_camera_done(val=0)
                    self.states[item] = b
            # for item in self.st_done_test:
            #     db_number, start, bit = get_addr(self.st_done_test[item])
            #     print(db_number, start, bit, end=': ')
            #     b = get_bit_value(db_value, start, bit)
            #     print(b)
            time.sleep(0.1)

    def test2(self):

        db_number = 1

        offset = 0

        v = self.reader.read(db_number, offset, 1399 - offset)
        print(v)
        b = get_bit_value(v, 0, 7)
        print('------', b)
        # for item in self.st_cfm:
        #     addr = self.st_cfm[item]
        #     db_number, start, bit = get_addr(addr)
        #     print(db_number, start, bit, end=',')
        #     b = get_bit_value(v, start - offset, bit)
        #     print(b, end='\n')
        #     self.red.publish('ST10_EVENT', '{"device":"ptl_1","value":1}')
        print('\n')

    def run(self):
        """
        """
        while True:
            try:
                self._execute()
            except Exception as ex:
                print(traceback.print_exc())

            time.sleep(self.interval)

    def _execute(self):
        """
        
        """
        offset = 256

        v = self.reader.read(self.db_number, offset, 1100 - offset)

        # print(v)

        # v = get_bytes(v, 0, 8)

        # print(bytearray(v))

        stations = ['st00', 'st10', 'st20']

        # addrs = {'part1':'DB540,DBX1.1', 'part2':'DB540,DBX1.3', 'part3':'DB540,DBX1.2'}

        for key in self.ptl_done.keys():

            db_number, start, bit = get_addr(self.ptl_done[key])

            start = start - offset

            print(db_number, start, bit)

            # get bit value
            b = get_bit_value(v, start, bit)

            for ch in self.station_val:
                val = self.station_val[ch]
                if val == b:
                    print('same')
                else:
                    print(ch, b)
                    v = self.red.set(ch, b)
                    # print('set:',v)
                    v = self.red.get(ch)

                    print('get:', v)

                    self.red.publish('ST10_EVENT', '{"device":"ptl_1","value":1}')
                    # self.red.lpush('DQ','ab')

            # print(start, bit)

        # self.reader.set_bool(db_number, start, bit, True)

        # self.reader.write_sn(db_number, 1, b'abce0000')

        # ps = red.pubsub()

        # ps.subscribe(['OPTIONS', 'mabo'])


def main():
    """
    """

    checker_write = Writer()
    checker_read = Checker(checker_write)
    t1 = threading.Thread(target=checker_read.test1, args=[])
    t2 = threading.Thread(target=checker_write.run, args=[])
    t3 = threading.Thread(target=checker_read.publish_event, args=[])
    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()
    # checker_read.test()


if __name__ == '__main__':
    main()
