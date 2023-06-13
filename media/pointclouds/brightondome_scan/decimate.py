import csv
import random

out_rows = []

with open('cloud_rand.xyz', mode='w') as out_file:
	out_writer = csv.writer(out_file, delimiter=' ')
	with open('cloud.xyz') as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=' ')
		line_count = 0
		for row in csv_reader:
			out_rows.append(row)
			line_count += 1

		print(f'Processed {line_count} lines.')

	random.shuffle(out_rows)
	for row in out_rows:
		out_writer.writerow(row)