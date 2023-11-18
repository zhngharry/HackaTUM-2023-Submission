
import json

def find_highest_max_driving_distance(service_providers):
    highest_distance = 0

    for provider in service_providers:
        max_driving_distance = provider.get('max_driving_distance', 0)
        if max_driving_distance > highest_distance:
            highest_distance = max_driving_distance

    return highest_distance

if __name__ == "__main__":
    service_provider_file = "service_provider_profile.json"

    with open(service_provider_file, 'r') as sp_file:
        service_providers = json.load(sp_file)

    highest_distance = find_highest_max_driving_distance(service_providers)

    print(f"The highest max_driving_distance among service providers is: {highest_distance} m")
