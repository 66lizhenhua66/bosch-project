# -*- coding: utf-8 -*-
import threading
import pyodbc
import queue
import time
import redis


class DB(object):
    # 程序最先初始化，遍历报警资料表
    # 只抓取最新一条信息进行判断
    def __init__(self):
        self.last_id = None
        self.cursor = self.connect()
        self.rd = redis.Redis(host='192.168.100.1', port=6379)
        self.publish_q = queue.Queue()

    def connect(self):
        # 连接数据库
        conn_str = (r'DRIVER={SQL Server};'
                    r'SERVER=10.54.53.111;'
                    r'PORT=1433;'
                    r'DATABASE=cvi.net;'
                    r'UID=cvinetuser;'
                    r'PWD=admin')
        cnxn = pyodbc.connect(conn_str)
        print("Connected Success")
        cursor = cnxn.cursor()
        cursor.execute("SELECT MAX(RES_ID) FROM [dbo].[RESULT];")
        row = cursor.fetchone()
        self.last_id = row[0]
        print(self.last_id)
        return cursor

    def run(self):
        # 初始化后，进行抓取最后新数据循环
        while True:

            try:
                self.cursor.execute(
                    """
                    SELECT RES_ID, RES_ControllerId, RES_FinalTorque, RES_FinalAngle, RES_Report 
                    FROM [dbo].[RESULT] WHERE RES_ID > %d;
                    """ % self.last_id)
                rows = self.cursor.fetchall()
                result_length = len(rows)
                if result_length == 2:
                    # 如果得到结果为2条，即更新了两条，如果两条的控制器ID不一样,且扭矩都有结果，则是最新的两条数据
                    if not rows[0][1] == rows[1][1] and rows[0][2] and rows[1][2]:
                        self.prepare_data(rows[0], rows[1], 2)
                elif result_length == 4:
                    # 如果得到4条，两种情况：
                    if rows[0][2] and rows[1][2] and rows[2][2] and rows[3][2]:
                        # 1. 4条都为真，选前两条，
                        self.prepare_data(rows[0], rows[1], 2)
                    else:
                        # 2. 只有两条为真，选其中有数值的
                        result_li = list()
                        # 遍历四条结果，将有结果的两条数据存到临时变量 result_li中
                        for row in rows:
                            if row[2]:
                                result_li.append(row)
                        if not len(result_li) == 2:
                            raise Exception("遍历4条结果都有情况下失败，请联系管理员")
                        self.prepare_data(result_li[0], result_li[1], 4)
                elif result_length > 4:
                    print("结果过多，将重置last_id")
                    self.cursor.execute("SELECT MAX(RES_ID) FROM [dbo].[RESULT];")
                    row = self.cursor.fetchone()
                    self.last_id = row[0]
                time.sleep(0.5)
            except Exception as e:
                self.cursor.execute("SELECT MAX(RES_ID) FROM [dbo].[RESULT];")
                row = self.cursor.fetchone()
                self.last_id = row[0]

    def prepare_data(self, torque_1, torque_2, count):
        """
        torque_1: [res_id, res_controlleId, res_torque, res_angle, res_report]
        torque_2: [res_id, res_controlleId, res_torque, res_angle, res_report]
        """
        # rd.publish('A10_EVENT', {"type": "torque", "station": "ST40", "device": "1", "torque": "53Nm", "angle": "20", "result": 1})
        data_1 = {"type": "torque", "station": "ST50", "device": "5",
                  "torque": str(torque_1[2]) + "Nm", "angle": str(torque_1[3]),
                  "result": 1 if torque_1[4] == 'OK' else 0}
        self.publish_q.put(data_1)
        data_2 = {"type": "torque", "station": "ST50", "device": "5",
                  "torque": str(torque_2[2]) + "Nm", "angle": str(torque_2[3]),
                  "result": 1 if torque_2[4] == 'OK' else 0}
        self.publish_q.put(data_2)
        self.last_id += count
        print("prepare data:  ", self.last_id)

    def publish(self):
        """只要有数据，就独立线程进行发布"""
        while True:
            data = self.publish_q.get()
            self.rd.publish('A10_EVENT', data)


def main():
    db = DB()
    threading.Thread(target=db.publish).start()
    db.run()


if __name__ == '__main__':
    main()
