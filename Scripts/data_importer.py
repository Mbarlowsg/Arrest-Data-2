"""
Script takes two arguments in the cli
1. the URL for the geojson data
2. the name of the file to save data to
"""

import requests
import json
import time
import sys

# Select the resource to download
resource_url = sys.argv[1]

# Request to download the file from the Internet
response = requests.get(resource_url, time.sleep(10))

if response:
    json_response = response.json()

with open(f'{sys.argv[2]}.geojson', 'w') as writer:
    json.dump(json_response, writer, ensure_ascii=True, indent=4, allow_nan=True)
