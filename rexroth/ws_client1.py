import redis
import time


print('acb')
rd = redis.Redis()

rd.lpush()

# plc --->>>  browser
rd.publish("A10_EVENT", {"type": "state", "device": "ptl_3", "value": 0, "station": "ST10"})
rd.publish("A10_EVENT", {"type": "state", "device": "ptl_2", "value": 0, "station": "ST20"})
rd.publish("A10_EVENT", {"type": "state", "device": "ptl_3", "value": 1, "station": "ST30"})
#   next
rd.publish("A10_EVENT", {"type": "state", "device": "next", "value": 1, "station": "ST10"})



# scan_gun --->>> browser
rd.publish("A10_SN", {"type": "add_sn", "sn": "10000000", "complete": 1, "station": "ST10"})
rd.publish("A10_SN", {"type": "add_sn", "sn": "32343236", "complete": 1, "station": "ST70"})
rd.publish("A10_SN", {"type": "add_sn", "sn": "12345679", "complete": 0, "station": "ST10"})
rd.expire('txt_set', 10)

# press --->>> browser
rd.publish("A10_SN", {"type": "press", "station": "ST10", "device": "1", "move": "20", "pressure": "20", "result": 1})

# torque --->>> browser
# recv_data: { "type": "torque", "station": "ST40", "device": "1", "torque": '50Nm', "angle": '20', "result": 1}
rd.publish('A10_EVENT', {"type": "torque", "station": "ST40", "device": "1", "torque": "53Nm", "angle": "20", "result": 1})


# plc ---->>>  camera
camera_num = rd.get('camera_num')
rd.publish('CAMERA', camera_num)

# camera ---->>>  browser
rd.publish('A10_EVENT', {"type": "photo", "left_path": "/assets/camera-photoes/2.bmp",
                        "right_path": "/assets/camera-photoes/1.bmp", "result": 1, "station": "ST40"})


# browser --->>> plc   # json����˫����

while True:
   now_time = int(time.time())
   print(now_time)
   if rd.sadd("option_sets", now_time):
       rd.hset("option_hashes", now_time, '{"method": "write_ptl", "params": 1, "station": "st10"}')
       rd.publish("START", now_time)
       break


rd.lpush("OPTIONS", "{'method': 'write_ptl', 'params': ptl_number, 'station': 'st10'}")
#          &&
rd.publish("START", time.time())


rd.lpush("OPTIONS", "{'method': 'write_rfid', 'params': '12345678', 'station': 'st10'}")
#          &&
rd.publish("START", time.time())

rd.lpush("OPTIONS", "{'method': 'complete', 'params': 'st20', 'station': 'st20'}")
#          &&
rd.publish("START", time.time())





