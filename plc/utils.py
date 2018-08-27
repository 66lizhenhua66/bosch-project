# -*- coding: utf-8 -*-
import logging
import sys
import re


def get_addr(addr):
    if addr.count('DBB'):
        rawstr = r"""DB(\d+)\.DBB(\d+)"""
        compile_obj = re.compile(rawstr)
        match_obj = compile_obj.search(addr)

        # method 2: using search function (w/ external flags)
        #match_obj = re.search(rawstr, matchstr)

        # method 3: using search function (w/ embedded flags)

        if match_obj != None:
            # Retrieve group(s) from match_obj
            all_groups = match_obj.groups()

            # Retrieve group(s) by index
            db_number = int(match_obj.group(1))
            start = int(match_obj.group(2))
            return (db_number, start)
        else:
            raise(Exception)
            
    else:
            
        rawstr = r"""DB(\d+)\.DBX(\d+)\.(\d+)"""

        # method 1: using a compile object
        compile_obj = re.compile(rawstr)
        match_obj = compile_obj.search(addr)

        # method 2: using search function (w/ external flags)
        #match_obj = re.search(rawstr, matchstr)

        # method 3: using search function (w/ embedded flags)

        if match_obj is not None:
            # Retrieve group(s) from match_obj
            all_groups = match_obj.groups()

            # Retrieve group(s) by index
            db_number = int(match_obj.group(1))
            start = int(match_obj.group(2))
            bit = int(match_obj.group(3))
            return (db_number, start, bit)
        else:
            print(addr)
            #raise(Exception)


def get_logger(logger_name):
    """创建一个logger,并返回"""
    plc_logger = logging.getLogger(logger_name)
    formatter = logging.Formatter('%(asctime)s %(levelname)-8s [%(name)s]: %(message)s')
    # plc_logger.setLevel('DEBUG')
    file_handle = logging.FileHandler("./plc.log")
    file_handle.setLevel('DEBUG')
    file_handle.setFormatter(formatter)
    plc_logger.addHandler(file_handle)
    # console_handle = logging.StreamHandler(sys.stdout)
    # console_handle.setLevel('DEBUG')
    # console_handle.setFormatter(formatter)
    # plc_logger.addHandler(console_handle)
    return plc_logger
