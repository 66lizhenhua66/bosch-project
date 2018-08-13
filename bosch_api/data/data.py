# -*- coding: utf-8 -*-
from __future__ import print_function

import datetime
import msgpack
import json
import logging
import constants
from jsonrpc import dispatcher

from sql.sql_data import pgsql
from utils.utils import datetime_string, decode_utf_8
from utils.redis import Redis
from test_data import KEY, EMPLOYEE_KEY, STEP_KEY
from operator import itemgetter
from utils._compat import range_type

log = logging.getLogger(constants.LOG_NAME)

rd = Redis()


@dispatcher.add_method
def get_programs():
    """获得所有的program"""
    rows = pgsql.select("""
        SELECT station, program_number, detail_program, product_number FROM programs WHERE is_delete = 0
    """)
    temp_data = list()
    for station, program_number, detail_program, product_number in rows:
        temp_data.append({'station': station,
                          'program_number': program_number,
                          'detail_program': detail_program,
                          'product_number': product_number,
                          })
    # print(temp_data)
    return temp_data


@dispatcher.add_method
def get_all_pNumbers():
    """获得所有的程序号，去重"""
    rows = pgsql.select("SELECT DISTINCT program_number FROM programs;")
    number_list = list()
    for item in rows:
        number_list.append(item[0])
    return {"program_numbers": number_list}


@dispatcher.add_method
def save_programs(programs):
    """保存或添加一个程序"""
    rows = pgsql.select("SELECT program_number FROM programs WHERE program_number=%s", (programs[0]['program_number'],))
    results = {}

    for program in programs:
        detail_program = json.dumps(program['detail_program'])
        product_number = program['product_number'] if 'product_number' in program else ''
        # print("product_number..", product_number)
        if not rows:
            sql = """
              INSERT INTO programs (station, program_number, detail_program, product_number) VALUES (%s, %s, %s, %s);
            """
            result = pgsql.execute_sql(
                sql,
                (program['station'], program['program_number'],
                    detail_program, product_number)
            )
            results[program['station']] = result
            # print('insert')
        else:
            sql = """
               UPDATE programs SET detail_program=%s, product_number=%s WHERE program_number=%s AND station=%s;
            """
            result = pgsql.execute_sql(
                sql, (detail_program, product_number, program['program_number'], program['station']))
            results[program['station']] = result
            # print('update')
    return results


@dispatcher.add_method
def rename_program(old_number, new_number):
    """重新命名程序号"""
    result = pgsql.execute_sql("""
        UPDATE programs SET program_number=%s WHERE program_number=%s;
    """, (new_number, old_number))
    return result


@dispatcher.add_method
def add_program(**kwargs):
    """添加一个program"""
    # print(kwargs)
    if 'station' not in kwargs or 'program_number' not in kwargs or 'detail_program' not in kwargs:
        return False

    return pgsql.execute_sql(
        "INSERT INTO programs(station, program_number, detail_program) VALUES(%s, %s, %s)",
        (kwargs['station'], kwargs['program_number'], json.dumps(kwargs['detail_program']))
    )


@dispatcher.add_method
def delete_program(**kwargs):
    """逻辑删除一个program"""
    if 'program_number' not in kwargs:
        return False
    return pgsql.execute_sql(
        "UPDATE programs SET is_delete=1 WHERE program_number=%s",
        (kwargs['program_number'],)
    )


@dispatcher.add_method
def update_program(**kwargs):
    """更新一个程序"""
    if 'program_number' not in kwargs or 'detail_program' not in kwargs:
        return False

    return pgsql.execute_sql(
        "UPDATE programs SET detail_program=%s WHERE program_number=%s;",
        (json.dumps(kwargs['detail_program']), kwargs['program_number'])
    )


@dispatcher.add_method
def get_orders():
    """获得当天所有订单跟程序序列号的数据"""
    rows = pgsql.select("SELECT sn_number, program_number, order_number, is_publish FROM orders;")
    orders = list()
    for sn_number, proram_number, order_number, is_publish in rows:
        orders.append(
            {
                'sn_number': sn_number,
                'program_number': proram_number,
                'order_number': order_number,
                'is_publish': True if is_publish else False
            }
        )

    return {"orders": orders}


@dispatcher.add_method
def publish_orders(orders):
    """发布订单，即插入新的数据"""
    for order in orders:
        pgsql.execute_sql(
            "INSERT INTO orders(sn_number, program_number, order_number) VALUES (%s, %s, %s)",
            (order['sn_number'], order['program_number'], order['order_number'])
        )
    return True


@dispatcher.add_method
def get_station_data(station_name, sn_number):
    """根据工站及序列号，获得对应的数据"""
    rows = pgsql.select("""
    SELECT sn_number, program_number, order_number, is_publish FROM orders WHERE sn_number=%s""",
                        (sn_number,))
    if len(rows) == 0:
        print("no order")
        return False
    selected_order = {}
    for s, p, o, i in rows:
        selected_order['sn_number'] = s
        selected_order['program_number'] = p
        selected_order['order_number'] = o
        selected_order['is_publish'] = True if i else False

    # print(selected_order["program_number"], station_name)
    rows = pgsql.select("""
    SELECT station, program_number, detail_program, product_number FROM programs WHERE program_number=%s AND station=%s;
    """, (selected_order['program_number'], station_name))
    if len(rows) == 1:
        # print('no data!!!')
        # return {'success': False, 'message': "no data!"}
        selected_program = dict()
        for station, program_number, detail_program, product_number in rows:
            selected_program['station'] = station
            selected_program['program_number'] = program_number
            selected_program['detail_program'] = detail_program
            selected_program['product_number'] = product_number
        # print(selected_program)
        # print('ookkkk')
        return {"selected_order": selected_order, "selected_program": selected_program}
    return False


import time


@dispatcher.add_method
def complete(station_name, sn_number):
    """完工"""
    print("complete")
    while True:
        now_time = int(time.time())
        if rd.sadd("option_sets", now_time):
            rd.hset("option_hashes", now_time,
                    '{"method": "write_complete", "params": "%s"}' % station_name)
            rd.publish("START", now_time)
            print('complete: ', station_name)
            break
    return True


@dispatcher.add_method
def write_ptl(ptl_number, val):
    """点亮对应的PTL的灯"""
    print("light ", ptl_number)
    while True:
        now_time = int(time.time())
        print(now_time)
        if rd.sadd("option_sets", now_time):
            rd.hset("option_hashes", now_time,
                    '{"method": "write_ptl_by_str", "params": "%s,%s"}' % (ptl_number, str(val)))
            rd.publish("START", now_time)
            break
    return True


@dispatcher.add_method
def take_photo(camera_num):
    """进行拍照"""
    print("camera_num", camera_num)
    if rd.set("camera_num", camera_num):
        return True
    return False


@dispatcher.add_method
def login(user, pw):
    """登陆"""
    row = pgsql.select("""
        SELECT show_name, img_path FROM users WHERE users.user_name=%s AND users.pw=%s AND users.is_delete=0;
    """, (user, pw))
    if not len(row) == 1:
        return False
    return {'user': row[0][0], 'img_path': row[0][1]}


@dispatcher.add_method
def get_users():
    """获得所有用户的信息"""
    rows = pgsql.select("""
        SELECT users.id, users.user_name, users.pw, users.show_name, users.img_path FROM users WHERE users.is_delete=0;
    """)
    temp_data = []
    for user_id, user, pw, show_name, img_path in rows:
        temp_data.append({
            'id': user_id,
            'user': user,
            'pw': pw,
            'show_name': show_name,
            'img_path': img_path
        })
    return temp_data


@dispatcher.add_method
def delete_user(user_id):
    """删除用户"""
    print("删除： ", user_id)
    result = pgsql.execute_sql("""
        UPDATE users SET is_delete=1 WHERE id=%d 
    """ % user_id)
    return result


@dispatcher.add_method
def save_user(user_name, pw, img_path, show_name, user_id):
    if user_id:
        print("进行更新")
        user_id = str(user_id)
        result = pgsql.execute_sql("""
            UPDATE users SET user_name=%s, pw=%s, img_path=%s, show_name=%s, is_delete=0 WHERE users.id=%s
            """, (user_name, pw, img_path, show_name, user_id))
        return result
    else:
        # 不存在则代表需要插入
        print("进行添加")
        result = pgsql.execute_sql("""
            INSERT INTO users (user_name, pw, img_path, show_name) VALUES (%s, %s, %s, %s);
            """, (user_name, pw, img_path, show_name))
        if result:
            new_user_id = pgsql.select("""SELECT users.id FROM users WHERE users.user_name='%s'""" % user_name)[0][0]
            return {'new_user_id': new_user_id}
        else:
            return False


@dispatcher.add_method
def station_login(card_id, station):
    """工站登陆"""
    print(card_id, station)
    rows = pgsql.select("""
        SELECT user_number, img_path, name, authority FROM station_users WHERE card_id=%s;
    """, (card_id, ))
    if len(rows) == 1:
        user_number, img_path, name, authority = rows[0]
        # 如果有权限，才返回登陆权限
        if authority[int(station) - 1]['value']:
            return {'show_name': name, 'img_path': img_path, 'user_number': user_number}
    return False


@dispatcher.add_method
def get_station_users():
    """获得所有工站员工信息
    :return [{'card_id': '', 'user_number': '', 'name': '', 'img_path': '', 'authority': [{'station': true, ...}]}]
    """
    rows = pgsql.select("""
        SELECT card_id, user_number, name, img_path, authority FROM station_users WHERE is_delete=0;
    
    """)
    temp = []
    for card_id, user_number, name, img_path, authority in rows:
        temp.append(
            {
                "card_id": card_id,
                "user_number": user_number,
                "name": name,
                "img_path": img_path,
                "authority": authority
            }
        )
    return temp


@dispatcher.add_method
def save_station_user(card_id, user_number, name, img_path, authority):
    """添加或更新员工信息"""
    if not card_id:
        return False
    row = pgsql.select("""
        SELECT user_number FROM station_users WHERE card_id=%s
    """, (card_id, ))
    if row:
        result = pgsql.execute_sql("""
            UPDATE station_users SET user_number=%s, name=%s, img_path=%s, authority=%s WHERE card_id=%s
        """, (user_number, name, img_path, json.dumps(authority), card_id))
    else:
        result = pgsql.execute_sql("""
            INSERT INTO station_users(card_id, user_number, name, img_path, authority) VALUES (%s, %s, %s, %s, %s);
        """, (card_id, user_number, name, img_path, json.dumps(authority)))
    return result


@dispatcher.add_method
def delete_station_user(card_id):
    """删除员工信息"""
    if card_id:
        return pgsql.execute_sql("""
            UPDATE station_users SET is_delete=1 WHERE card_id=%s
        """, (card_id, ))
    return False












