# -*- coding: utf-8 -*-
import waitress

from web.app import api as app
from log.log_init import init_log
from utils.utils import get_conf


def init_():
    # 日志初始化
    init_log()


if __name__ == '__main__':
    conf = get_conf()
    # init_()
    sv = conf.get('server', {})
    host = sv.get('host', '0.0.0.0')
    port = sv.get('port', 8888)
    # print(host, port)
    waitress.serve(app, host=host, port=port, _quiet=True)

