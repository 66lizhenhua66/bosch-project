# -*- coding: utf-8 -*-
import redis

import constants


class Redis(object):
    def __init__(self, redis_url=None, strict=True, *args, **kwargs):
        self._redis_class = redis.StrictRedis if strict else redis.Redis
        self._redis_kwargs = kwargs
        if not redis_url:
            redis_url = constants.REDIS_URL

        self._redis_client = self._redis_class.from_url(
            redis_url, **self._redis_kwargs)

    def __getattr__(self, name):
        return getattr(self._redis_client, name)

    # def __setitem__(self, key, value):
    #     self._redis_client[key] = value

    # def __getitem__(self, key):
    #     return self._redis_client[key]


if __name__ == '__main__':
    pass
