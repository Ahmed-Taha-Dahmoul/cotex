import csv

# Read the CSV file
with open('game.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    rows = list(reader)

# The first row is the header
header = rows[0]
# The remaining rows are the data
data = rows[1:]

# Reverse the data rows
data.reverse()

# Update the id field to be in reverse order
total_rows = len(data)
for index, row in enumerate(data):
    row[0] = str(total_rows - index)  # Assuming the id is the first column

# Combine the header with the reversed data
reversed_rows = [header] + data

# Write the reversed rows back to a new CSV file
with open('reversed_games_with_reversed_ids.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerows(reversed_rows)

print("The CSV file has been reversed, IDs reversed, and saved as 'reversed_games_with_reversed_ids.csv'.")
