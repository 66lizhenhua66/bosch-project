# -*- coding: utf-8 -*-
# @Author: caixin
# @Date:   2018-01-29 13:53:57
# @Last Modified by:   1249614072@qq.com
# @Last Modified time: 2018-03-06 14:29:09
import requests
import json


def test():
    url = "http://127.0.0.1:8000/api/sfproc"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
    }

    payload = {
        "method": "login",
        "params": {},
        "jsonrpc": "2.0",
        "id": "0"
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(response.json())


if __name__ == "__main__":
    test()
