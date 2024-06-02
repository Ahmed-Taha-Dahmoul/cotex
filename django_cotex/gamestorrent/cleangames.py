import json

# Function to filter out elements based on link containing www.gamestorrents.fm
def clean_json(json_data):
    cleaned_data = [item for item in json_data if 'www.gamestorrents.fm' in item['link']]
    return cleaned_data

# Read JSON data from file
with open('scrapped_games_everyday.json', 'r') as file:
    json_data = json.load(file)

# Clean the JSON data
cleaned_json_data = clean_json(json_data)

# Write cleaned JSON data back to file
with open('cleaned_data.json', 'w') as file:
    json.dump(cleaned_json_data, file, indent=4)
