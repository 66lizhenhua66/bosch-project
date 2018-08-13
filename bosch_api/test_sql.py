# -*- coding: utf-8 -*-
# @Author: caixin
# @Date:   2018-03-06 11:25:37
# @Last Modified by:   1249614072@qq.com
# @Last Modified time: 2018-03-24 16:02:50
from sql.sql_data import call_proc


def test_employee():
    a = call_proc(
        #'AP_3DXML.ProcTdXml_GetEmployee',
       'AP_3DXML.ProcTdXml_GetGenelogy',
        (
           # 'gujw',
            'YJYP',
        ),
        #var_num=3,
        var_num=10,
        #num=0,
        num=0,
    )

    print('[+] Employee', a)


if __name__ == '__main__':
    test_employee()
