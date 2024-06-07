import json

def reverse_json(input_file, output_file):
    with open(input_file, 'r') as f:
        data = json.load(f)

    data.reverse()  # Reverse the order of elements

    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

    print("JSON reversed and saved to", output_file)

# Input and output file paths
input_file = "visited_links_everyday.json"
output_file = "output.json"

# Call the function
reverse_json(input_file, output_file)
