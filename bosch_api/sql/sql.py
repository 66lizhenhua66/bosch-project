# -*- coding: utf-8 -*-
from __future__ import print_function

import psycopg2

import logging
import time
import re

import constants
from utils.utils import get_conf
from utils._compat import range_type

log = logging.getLogger(constants.LOG_NAME)


class PgSQL(object):
    def __init__(self, conf=None):
        if not conf:
            conf = get_conf()
        self.conf = conf['pgsql']
        self.host = self.conf.get('host', '127.0.0.1')
        self.port = self.conf.get('port', 5432)
        self.user = self.conf.get('user', 'postgres')
        self.password = self.conf.get('password', 'boshi')
        self.database = self.conf.get('database', 'boshi')

    def get_conn(self):
        """连接数据库"""
        conn = None
        while True:
            try:
                conn = psycopg2.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,)
            except Exception as e:
                log.error(e)
                time.sleep(2)
                conn = None
            finally:
                if conn:
                    break
        return conn

    def execute_sql(self, sql, params=''):
        conn = None
        cursor = None
        try:
            conn = self.get_conn()
            cursor = conn.cursor()
            if params:
                cursor.execute(sql, params)
            else:
                cursor.execute(sql)
            conn.commit()
            return True
        except Exception as e:
            print(e)
            log.error(e)
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    def select(self, sql, params=""):
        """查询"""
        conn = None
        cur = None
        try:
            conn = self.get_conn()
            cur = conn.cursor()
            if params:
                cur.execute(sql, params)
            else:
                cur.execute(sql)
            rows = cur.fetchall()
            return rows
        except Exception as e:
            log.error(e)
            print(e)
            return []
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    def list_json(self, sql, rows):
        """将查询的结果拼成json返回"""
        patter = re.compile('select (.*).from', re.I | re.S)
        result = patter.findall(sql)
        result = result[0] if result else ['']
        result = result.split(',')
        if not result[-1]:
            result = result[:-1]


if __name__ == '__main__':
    pass
