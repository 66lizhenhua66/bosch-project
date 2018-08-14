# -*- coding: utf-8 -*-
import requests
import json


def test():
    url = "http://127.0.0.1:8000/api/program"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic bWFibzptYWJv",
    }

    payload = {
        "method": "get_orders",
        "params": {},
        "jsonrpc": "2.0",
        "id": "0"
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(response.json())


if __name__ == "__main__":
    test()
