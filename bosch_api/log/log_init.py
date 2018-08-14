# -*- coding: utf-8 -*-
import logging.config


def init_log(log_file='log/log.conf'):
    logging.config.fileConfig(log_file)


if __name__ == '__main__':
    pass
