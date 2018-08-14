# -*- coding: utf-8 -*-
import toml
import datetime
import time
import threading

import constants
from ._compat import PY3, urlparse, parse_qs, string_types


def get_conf(conf_file_path=constants.CONFIG):
    return toml.load(conf_file_path)


def urlDict(url):
    """
    url参数转字典
    """
    if not isinstance(url, string_types):
        raise TypeError('string type')
    query = urlparse(url).query
    return dict([(k, v[0]) for k, v in parse_qs(query).items()])


def streamDcit(value):
    if not isinstance(value, string_types):
        raise TypeError('string type')

    return dict([(k, v[0]) for k, v in parse_qs(value).items()])


def timestamp_datetime(timestamp):
    if isinstance(timestamp, (string_types, float)):
        timestamp = int(timestamp)
    return datetime.datetime.fromtimestamp(timestamp)


def datetime_string(dt, strftime='%Y-%m-%d %H:%M:%S'):
    if not isinstance(dt, datetime.datetime):
        raise TypeError('datetime type')
    return dt.strftime(strftime)


def timestamp_string(timestamp, strftime='%Y-%m-%d %H:%M:%S'):
    dt = timestamp_datetime(timestamp)
    return datetime_string(dt)


def string_timestamp(time_string, strftime='%Y-%m-%d %H:%M:%S'):
    dt = time.strptime(time_string, strftime)
    timestamp = time.mktime(dt)
    return timestamp


def decode_utf_8(v):
    if v and PY3:
        return v.decode('utf-8')
    return v


def dir_config(obj, *args, **kwargs):
    if not isinstance(obj, object):
        raise TypeError("It's not a object.")

    try:
        return {k: getattr(obj, k) for k in dir(obj) if k.isupper()}
    except Exception as e:
        raise e


if __name__ == '__main__':
    pass
