import json
from haversine import haversine, Unit
import redis

def calculate_and_save_closest_postcode(providers_data, postcodes_data, redis_client):
    # Iterate over providers
    for provider in providers_data:
        provider_id = provider["id"]
        print(provider_id)
        provider_coords = (provider["lat"], provider["lon"])

        # Initialize variables to track closest postcode
        closest_postcode = None
        min_distance = float('inf')

        # Iterate over postcodes
        for postcode in postcodes_data:
            postcode_coords = (postcode["lat"], postcode["lon"])
            distance = haversine(provider_coords, postcode_coords, unit=Unit.METERS)

            # Update closest postcode if the new distance is smaller
            if distance < min_distance:
                min_distance = distance
                closest_postcode = postcode["postcode"]

        # Save the result to Redis
        redis_key = f"provider_{provider_id}"
        redis_subkey = "nearest_plz"
        redis_client.hset(redis_key, redis_subkey, closest_postcode)

    # Print the results
    for key in redis_client.keys("provider_*"):
        print(f"{key}: {redis_client.hgetall(key)}")

if __name__ == "__main__":
    # Read data from JSON files
    with open('service_provider_profile.json', 'r') as file:
        providers_data = json.load(file)

    with open('postcode.json', 'r') as file:
        postcodes_data = json.load(file)

    # Connect to the Redis server
    redis_client = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

    # Call the function to calculate and save the closest postcode for each provider
    calculate_and_save_closest_postcode(providers_data, postcodes_data, redis_client)
