# -*- coding: utf-8 -*-
import falcon
import logging
from jsonrpc import JSONRPCResponseManager
import json

import constants
# from .middleware import AuthMiddleware

from data.data import dispatcher


log = logging.getLogger(constants.LOG_NAME)


class BOSHI(object):
    def on_post(self, req, resp):
        resp.content_type = 'application/json'
        resp_data = req.stream.read()
        # print(resp_data)

        log.debug('resp: %s' % (resp_data))
        response = JSONRPCResponseManager.handle(resp_data, dispatcher)
        resp.body = response.json
        resp.status = falcon.HTTP_200


class Test(object):
    def on_get(self, req, resp):
        resp.body = 'success'
        resp.status = falcon.HTTP_200


# api = falcon.API(middleware=[
#     AuthMiddleware()
# ])

api = falcon.API()

api.add_route('/api/test', Test())

api.add_route('/api/program', BOSHI())

