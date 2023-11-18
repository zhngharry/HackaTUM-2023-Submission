import json
import redis

def load_postcode_groups(json_file, redis_host='localhost', redis_port=6379, redis_db=0):
    # Connect to the Redis database
    r = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db)

    # Read JSON data from file
    with open(json_file, 'r') as file:
        json_data = json.load(file)

        # Iterate through each entry in the JSON data
        for entry in json_data:
            # Extract relevant information
            postcode = entry.get("postcode")
            print(postcode)
            distance_group = entry.get("postcode_extension_distance_group")

            # Check if the required fields are present in the entry
            if postcode is not None and distance_group is not None:
                # Create key-value pair (postcode+"_group": distance_group) and store in Redis
                key = f"{postcode}_group"
                value = distance_group.replace("group_", "")  # Remove "group_" from the distance group
                r.set(key, value)
            else:
                print("Skipping entry - missing required fields")

if __name__ == "__main__":
    # Specify the path to your JSON file
    json_file_path = 'postcode.json'

    # Call the function to load data into Redis
    load_postcode_groups(json_file_path)
