import json
from haversine import haversine
import redis

""" 
This script calculates every neighbour PLZ for every PLZ and stores those to the database.
This is done by matching edge points: If two PLZ have the same edge points they are evaluated to be
neighbours. 
"""

MAX_NEIGHBOUR_DISTANCE = 30

with open('everything.json', 'r') as file:
    everything = json.load(file)

# Connect to Redis
redis_conn = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)


pzl_map = {}

c = 0

for pzl in everything:
    long = pzl.get('geo_point_2d').get('lon')
    lat = pzl.get('geo_point_2d').get('lat')

    if pzl.get('name') not in pzl_map:
        pzl_map[pzl.get('name')] = []

    x_coords = pzl.get('geometry').get('geometry').get('coordinates')[0]
    if not x_coords:
        continue

    for y in everything:
        longy = y.get('geo_point_2d').get('lon')
        laty = y.get('geo_point_2d').get('lat')
        yname = y.get('name')
        if yname in pzl_map.get(pzl.get('name')) or yname is pzl.get('name'):
            continue

        if haversine((lat, long), (laty, longy), unit='km') < MAX_NEIGHBOUR_DISTANCE:
            for x_coord in x_coords:
                if x_coord in y.get('geometry').get('geometry').get('coordinates')[0]:
                    redis_conn.sadd(pzl.get('name'), y.get('name'))
                    #pzl_map.get(pzl.get('name')).append(y.get('name'))
                    break
    c += 1
    print(c)
