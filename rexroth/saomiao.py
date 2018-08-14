import sys
import time
import re
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QAction, QMessageBox
from redishelper import  RedisHelper
from PyQt5.QtCore import pyqtSlot
from PyQt5.Qt import QLineEdit,QLabel

class App(QWidget):

    def __init__(self):
        super().__init__()
        self.title = '扫描枪输入'
        self.left = 600
        self.top = 600
        self.width = 320
        self.height = 135
        self.initUI()
        self.pattern = re.compile(r'\d{8}')

    def initUI(self):
        self.setWindowTitle(self.title)
        self.setGeometry(self.left, self.top, self.width, self.height)

        # create textbox
        self.textbox = QLineEdit(self)
        self.textbox.move(20, 20)
        self.textbox.resize(280, 40)

        self.lb1 = QLabel(self)
        self.lb1.move(20,80)

        self.show()

    @pyqtSlot()
    def on_click(self):
        input_value = self.textbox.text()
        # print(type(input_value))
        if self.pattern.match(input_value):
            
            textboxValue = input_value
            print(textboxValue)
            #发布到redis
            obj = RedisHelper()
            for i in range(1,8):
                obj.publish({"type": "add_sn", "sn":textboxValue , "complete": 1, "station": 'ST'+str(i)+'0'})#发布

            rd = obj.get_redis()
            while True:
                now_time = int(time.time())
                if rd.sadd("option_sets", now_time):
                    rd.hset("option_hashes", now_time,
                            '{"method": "write_complete", "params": "%s"}' % "ST10")
                    rd.publish("START", now_time)
                    print('station_name complete')
                    break

            #结果存到label中
            self.lb1.setText(textboxValue)
            self.lb1.adjustSize()
            """打印完毕之后清空文本框"""
            self.textbox.setText('')
        else:
            self.textbox.setText('')
            print("序列号位数不对")

    def keyPressEvent(self, event):
        # 这里event.key（）显示的是按键的编码
        # print("按下：" + str(event.key()))
        if str(event.key()) == '16777220':  # 回车16777220
            self.on_click()
            print('ok')
        else:
            print('安下：' + str(event.key()))
            print('value')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = App()
    app.exit(app.exec_())
