# -*- coding: utf-8 -*-
# @Author: caixin
# @Date:   2017-10-18 22:25:12
# @Last Modified by:   1249614072@qq.com
# @Last Modified time: 2017-10-30 15:06:32
import logging.config


def init_log(log_file='log/log.conf'):
    logging.config.fileConfig(log_file)


if __name__ == '__main__':
    pass
