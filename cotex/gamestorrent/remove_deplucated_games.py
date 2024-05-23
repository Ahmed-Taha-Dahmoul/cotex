import json

# Function to remove duplicates
def remove_duplicates(data):
    seen = set()
    unique_data = []
    for item in data:
        identifier = (item['title'], item['link'])
        if identifier not in seen:
            seen.add(identifier)
            unique_data.append(item)
    return unique_data

# Read JSON data from file
with open('visited_links.json', 'r') as file:
    json_data = json.load(file)

# Removing duplicates
unique_json_data = remove_duplicates(json_data)

# Write the cleaned data back to the file
with open('visited_links.json', 'w') as file:
    json.dump(unique_json_data, file, indent=4)

print("Duplicates removed and data saved back to visited_links.json")
