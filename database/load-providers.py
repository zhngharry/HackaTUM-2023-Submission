import json
import redis

def store_provider_data_in_redis():
    # Connect to the Redis database
    redis_client = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

    # Read the first JSON file (service_provider_profile.json)
    with open('service_provider_profile.json', 'r') as file:
        service_provider_data = json.load(file)

    # Read the second JSON file (quality_factor_score.json)
    with open('quality_factor_score.json', 'r') as file:
        quality_factor_data = json.load(file)

    # Combine data from both JSONs and store in Redis
    for provider_profile, quality_score in zip(service_provider_data, quality_factor_data):
        # Check if the ids match
        if provider_profile['id'] == quality_score['profile_id']:
            pid = provider_profile['id']
            print(pid)
            # Merge first_name and last_name into 'name'
            provider_profile['name'] = f"{provider_profile['first_name']} {provider_profile['last_name']}"
            del provider_profile['first_name']
            del provider_profile['last_name']

            del provider_profile['id']
            del quality_score['profile_id']

            provider_profile['profile_score'] = 0.4*quality_score['profile_picture_score'] + 0.6*quality_score['profile_description_score']

            # Combine data from both JSONs
            provider_profile.update(quality_score)

            # Store data in Redis
            redis_key = f"provider_{pid}"
            redis_client.hmset(redis_key, provider_profile)


    print("Data stored in Redis successfully.")

if __name__ == "__main__":
    store_provider_data_in_redis()
