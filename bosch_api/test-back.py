# -*- coding: utf-8 -*-
# @Author: caixin
# @Date:   2018-01-29 13:53:57
# @Last Modified by:   1249614072@qq.com
# @Last Modified time: 2018-03-06 14:29:09
import requests
import json


def test():
    url = "http://192.168.43.25/sfproc"
    headers = {'content-type': 'application/json'}

    # payload = {
    #     "method": "wip6_",
    #     "params": {
    #         "proc": "AP_3DXML.ProcTdXml_GetGenelogy",
    #         "var_num": 10,
    #         "num": 0,
    #     },
    #     "jsonrpc": "2.0",
    #     "id": '0'
    # }
    payload = {
        "method": "personnel",
        "params": {},
        "jsonrpc": "2.0",
        "id": "0"
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(response.content)


if __name__ == "__main__":
    test()
