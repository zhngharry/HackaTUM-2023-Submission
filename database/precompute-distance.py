
import json
import redis
from haversine import haversine

HIGHEST_DISTANCE = 150
MAX_PROVIDERS = 1000

def calculate_distance(provider, postcode):
    provider_coords = (provider["lat"], provider["lon"])
    postcode_coords = (postcode["lat"], postcode["lon"])
    distance = round(haversine(provider_coords, postcode_coords, unit='km'), 2)
    return distance


def decimal_to_base_n(decimal_number, base):
    if decimal_number < 0 or base < 2:
        raise ValueError("Input must be a non-negative integer and base must be greater than or equal to 2.")

    if decimal_number == 0:
        return '0'

    result = ""
    
    while decimal_number > 0:
        remainder = decimal_number % base
        result = chr(ord('0') + remainder) + result
        decimal_number = decimal_number // base

    return result

def compute_distances(service_providers, postcodes):
    for provider in service_providers:
        if provider['id'] < 34750:
            continue
        distances = {}  # A dictionary to collect distances for each postcode
        postcode_distances = []
        for postcode in postcodes:
            distance = calculate_distance(provider, postcode)
            if distance < HIGHEST_DISTANCE:
                pc_cmp = decimal_to_base_n(int(postcode['postcode']), 50)
                postcode_distances.append((distance, pc_cmp))

        # Sort the distances by the first element (distance)

        sorted_distances = sorted(postcode_distances, key=lambda x: x[0], reverse=True)
        distances[provider['id']] = sorted_distances
        insert_into_redis(redis_conn, distances)
        print(provider['id'])


def insert_into_redis(redis_conn, distances):
    for provider, distance_list in distances.items():
        if distance_list:
            redis_conn.zadd(provider, {postcode: distance for distance, postcode in distance_list})

if __name__ == "__main__":
    service_provider_file = "service_provider_profile.json"
    postcode_file = "postcode.json"

    # Connect to Redis
    redis_conn = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

    with open(service_provider_file, 'r') as sp_file:
        service_providers = json.load(sp_file)

    with open(postcode_file, 'r') as pc_file:
        postcodes = json.load(pc_file)

    compute_distances(service_providers, postcodes)

print("Distance computation completed. Results inserted into Redis.")
