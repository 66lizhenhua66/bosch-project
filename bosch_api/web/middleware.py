# -*- coding: utf-8 -*-
# @Author: caixin
# @Date:   2017-10-16 23:39:49
# @Last Modified by:   1249614072@qq.com
# @Last Modified time: 2017-11-13 18:04:55
import constants
import falcon


class AuthMiddleware(object):

    def process_request(self, req, resp):
        token = req.get_header('Authorization')

        challenges = ['Token type="Fernet"']

        if token is None:
            description = ('Please provide an auth token '
                           'as part of the request.')

            raise falcon.HTTPUnauthorized('Auth token required',
                                          description,
                                          challenges,
                                          href='http://docs.example.com/auth')

        if not self._token_is_valid(token):
            description = ('The provided auth token is not valid. '
                           'Please request a new token and try again.')

            raise falcon.HTTPUnauthorized('Authentication required',
                                          description,
                                          challenges,
                                          href='http://docs.example.com/auth')

    def _token_is_valid(self, token):
        if token == constants.TOKEN:
            return True
        else:
            return False
