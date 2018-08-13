# -*- coding: gbk -*-
import socket
import re
import redis
import time
import threading
import queue
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class CameraEventHandler(FileSystemEventHandler):
    """
    ['event_type', 'is_directory', 'key', 'src_path']
    """
    def __init__(self, path, rd):
        FileSystemEventHandler.__init__(self)
        self.path = path
        self.rd = rd
        self.data = {'left_path': '', 'right_path': '', 'station': 'ST40', "type": "photo", "result": 'n'}

    def on_created(self, event):
        """ test """
        if not event.is_directory and event.src_path.endswith('.bmp'):
            r = self.rd.sadd('bmp_set', event.src_path)
            if r:
                self.rd.expire('bmp_set', 10)
                bmp_path = event.src_path.replace(self.path, '')
                if bmp_path.count('CAM1') > 0:
                    self.data['left_path'] = bmp_path
                elif bmp_path.count('CAM2') > 0:
                    self.data['right_path'] = bmp_path
                # print(event.src_path, '2222222')
                self.publish()

    def reset_data(self):
        self.data['left_path'] = ''
        self.data['right_path'] = ''
        self.data['result'] = 'n'

    def on_modified(self, event):
        """ test """
        if not event.is_directory and event.src_path.endswith('.txt'):
            if self.rd.sadd('txt_set', event.src_path):
                self.rd.expire('txt_set', 10)
                # last_line = self.get_file_last_line(event.src_path)
                # print(last_line)
                print('modify..........')
                with open(event.src_path, 'r') as f:
                    lines = [line for line in f if not line == '\n' and not line == '\r']
                    last_line = lines[-1]
                    result = last_line[0:1]
                    self.data['result'] = result
                    # print("11111")
                    self.publish()

    def publish(self):
        """锟斤拷锟斤拷锟斤拷锟斤拷"""
        if self.data['left_path'] and self.data['right_path'] and self.data['result'].isdigit():
            print('publish....')
            self.data['result'] = 0 if self.data['result'] == '1' else 1
            self.data['left_path'] = '/cv-x' + self.data['left_path']
            self.data['right_path'] = '/cv-x' + self.data['right_path']
            time.sleep(1)
            print("相机结果发布： ", self.data)
            self.rd.publish('A10_EVENT', self.data)
            self.reset_data()


class TorqueEventHandler(FileSystemEventHandler):
    """
    ['event_type', 'is_directory', 'key', 'src_path']
    """

    def __init__(self, path, rd):
        FileSystemEventHandler.__init__(self)
        self.path = path
        self.rd = rd
        self.device_2_station = {'1': 'ST40', '2': 'ST60', '3': 'ST60', '4': 'ST70'}
        self.publish_q = queue.Queue()

    def on_modified(self, event):
        """ test """
        if not event.is_directory and event.src_path.endswith('.txt'):
            if self.rd.sadd('torque_txt_set', event.src_path):
                self.rd.expire('torque_txt_set', 60)
                temp_data = {'type': 'torque'}
                temp_path = event.src_path.replace(self.path, '')
                device = temp_path.split('\\')[1][-1]
                temp_data['device'] = device
                temp_data['station'] = self.device_2_station[device]
                try:
                    while True:
                        with open(event.src_path, 'r') as f:
                            for i, line in enumerate(f):
                                if i == 5:
                                    torque = line.split('M')[2].strip()
                                    # print("设备{}的扭矩大小为：{}Nm".format(device, torque))
                                    temp_data['torque'] = torque + 'Nm'
                                elif i == 6:
                                    angle = line.split('W')[2].strip()
                                    # print("设备{}的角度大小为：{}Nm".format(device, angle))
                                    temp_data['angle'] = angle
                                elif i == 3:
                                    result = line[-5:].strip()
                                    temp_data['result'] = 1 if result == 'OK' else 0
                                elif i > 6:
                                    break
                            # print(temp_data)
                        if 'torque' in temp_data and 'angle' in temp_data and 'result' in temp_data:
                            self.publish_q.put(temp_data)
                            break
                        else:
                            print("get torque or angle or result error!")
                            time.sleep(0.1)
                except Exception as e:
                    print(e)

    def publish(self):
        """将扭矩枪得到的结果发布出去"""
        while True:
            data = self.publish_q.get()
            print("扭矩枪结果发布：", data)
            self.rd.publish('A10_EVENT', data)


class Camera(object):
    def __init__(self, ip, port, rd):
        self.ip = ip
        self.port = port
        self.pro_num_re = re.compile(r'PR,\d,\d{3}')
        self.socket = None
        self.rd = rd
        self.sub = self.rd.pubsub()
        self.sub.subscribe('CAMERA')

    def connect(self):
        pass

    def excute_command(self, pro_num):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((self.ip, self.port))
        try:
            self.socket.send(b'R0\r')
            run_model = self.socket.recv(1024).decode().strip('\r')
            print(run_model)
            if run_model != "R0":
                raise Exception('change run model error!')
            self.socket.send(b'PR\r')
            current_pro_num = self.socket.recv(1024).decode().strip('\r')
            photo_res = ''
            if current_pro_num == 'PR,1,{}'.format(pro_num):
                self.socket.send(b'TA\r')
                photo_res = self.socket.recv(1024).decode().strip('\r')
            elif self.pro_num_re.match(current_pro_num):
                option = "PW,1,{}\r".format(pro_num).encode()
                self.socket.send(bytes(option))
                res = self.socket.recv(1024).decode().strip('\r')
                if res == 'PW':
                    self.socket.send(b'TA\r')
                    photo_res = self.socket.recv(1024).decode().strip('\r')
            else:
                raise Exception('pai zhao fail')

            if photo_res == 'TA':
                print("paizhaowancheng")
                time.sleep(1)
                self.publish_done()
        except Exception as e:
            print('connection is error!')
            print(e)
        finally:
            self.socket.close()

    def publish_done(self):
        now_time = int(time.time())
        print(now_time)
        if self.rd.sadd("option_sets", now_time):
            self.rd.hset("option_hashes", now_time, '{"method": "write_camera_done", "params": 1}')
            self.rd.publish("START", now_time)

    def run(self):
        for item in self.sub.listen():
            if item['type'] == 'message':
                pro_num = item['data'].decode()
                if pro_num.isdigit() and len(pro_num) == 3:
                    self.excute_command(pro_num)

    def test(self):
        self.excute_command('003')
        self.excute_command('004')


def main():
    rd = redis.Redis()

    # 监听相机按钮程序
    s = Camera('192.168.100.60', 8500, rd)
    t1 = threading.Thread(target=s.run)
    t1.start()

    # 监听相机结果文件夹
    camera_path = 'D:/static/cv-x'
    camera_event_handler = CameraEventHandler(camera_path, rd)
    camera_observer = Observer()
    camera_observer.schedule(camera_event_handler, camera_path, recursive=True)
    camera_observer.start()

    # 监听扭矩枪结果文件夹
    torque_path = 'D:/static/torque_data'
    torque_event_handler = TorqueEventHandler(torque_path, rd)
    torque_observer = Observer()
    torque_observer.schedule(torque_event_handler, torque_path, recursive=True)
    torque_observer.start()
    # 扭矩枪结果发布程序
    threading.Thread(target=torque_event_handler.publish).start()
    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            camera_observer.stop()
            torque_observer.stop()


if __name__ == "__main__":
    main()
