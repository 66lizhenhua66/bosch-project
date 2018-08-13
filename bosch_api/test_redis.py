# -*- coding: utf-8 -*-
# @Author: caixin
# @Date:   2018-02-06 21:34:38
# @Last Modified by:   1249614072@qq.com
# @Last Modified time: 2018-03-20 10:35:46
from utils.redis import Redis
import msgpack

rd = Redis()


# 无需集合
# print(rd.sadd('df', 'ss', 'zz'))  # 添加多个值到redis
# print(rd.sadd('dz', 'ss', 'zzz'))
# print(rd.scard('df'))  # 获取集合的数量
# print(rd.sdiff('df'))  # 返回所有集合成员
# print(rd.sinter('df', 'dz'))  # 返回交集
# print(rd.sismember('df', 'ss'))  # SISMEMBER  判断是否属于集合内
# print(rd.smembers('dz'))  # 返回集合 key 中的所有成员。不存在的 key 被视为空集合。
# print(rd.smove('df', 'dz', 'zz'))  # 把df集合的zz移动到dz
# print(rd.srem('df', 'ss'))  # 删除指定集合元素


# print(rd.smembers('df'))
# print(rd.smembers('dz'))

# print(rd.spop('df'))  # 移除并返回集合中的一个随机元素。

# class_name = 'EJWLJX'
# print(rd.lpush('sf_list', class_name))
# rd.delete('sf_list')
# rd.lpush('sf_list', 'JQZ')
# rd.lpush('sf_list_two', 'JQZ')
# rd.lpush('sf_list_three', 'JQZ')

# rd.lpush('sf_list', 'YJWLJX')
# rd.lpush('sf_list_two', 'YJWLJX')
# rd.lpush('sf_list_three', 'YJWLJX')

# rd.lpush('sf_list', 'PQJX')
# rd.lpush('sf_list_two', 'PQJX')
# rd.lpush('sf_list_three', 'PQJX')

# rd.lpush('sf_list', 'SZJ')
# rd.lpush('sf_list_two', 'SZJ')
# rd.lpush('sf_list_three', 'SZJ')

# rd.rpush('sf_personnel', 'songfw')
# rd.lrange('sf_list', 0, -1)


# rd.lpush('sf_list', 'YJWLJX')
# print(rd.rpop('sf_list'))
# print(rd.llen('sf_list'))
# print(rd.lrange('sf_list', 0, -1))
# rd.lpush('sf_packb', msgpack.packb(['s', 'z']))
# print(rd.lrange('sf_list_priority', 0, -1))
# print(msgpack.unpackb(rd.rpop('sf_packb')))
# print(rd.rpop('sf_list'))

# sub = rd.pubsub()
# sub.subscribe('atlas')
# while True:
#     _v = sub.parse_response()[2]
#     if isinstance(_v, bytes):
#         _v = eval(_v.decode('utf-8'))
#         print(_v)

rd.publish('atlas', {'ser_number': "A100", 'torque': 9})
