import json
import redis

def store_coordinates_in_redis(json_file):
    # Connect to Redis
    r = redis.StrictRedis(host='localhost', port=6379, db=0)

    # Read JSON data from the file
    with open(json_file, 'r') as file:
        data = json.load(file)

    # Iterate through each entry in the JSON data
    for entry in data:
        postcode = entry["postcode"]
        print(postcode)
        lat = entry["lat"]
        lon = entry["lon"]

        # Create hash key for coordinates
        hash_key = f"{postcode}_coord"

        # Store coordinates in the Redis hash
        r.hset(hash_key, "lat", lat)
        r.hset(hash_key, "lon", lon)

if __name__ == "__main__":
    json_filename = "postcode.json"
    store_coordinates_in_redis(json_filename)
