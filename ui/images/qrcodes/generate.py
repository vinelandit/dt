import segno
from segno import helpers

wifiName = 'ray'
wifiPassword = 'interactive'

urlsRemote = [
'https://ray.scot/et/spa/#/?pid=1&phash=7616',
'https://ray.scot/et/spa/#/?pid=2&phash=15227',
'https://ray.scot/et/spa/#/?pid=3&phash=22838'
]

urlsLocal = [
'https://imp-1-4.ray.scot/#/?pid=1&phash=7616',
'https://imp-1-4.ray.scot/#/?pid=2&phash=15227',
'https://imp-1-4.ray.scot/#/?pid=3&phash=22838'
]



wifiCode = helpers.make_wifi(ssid = wifiName, password = wifiPassword, security = 'WPA')
print(wifiCode.designator)
wifiCode.save('wifi.png', scale=10)

i = 1
for url in urlsRemote:
	q = segno.make(url)
	q.save('url_remote_' + str(i) + '.png', scale = 10)
	i += 1

i = 1
for url in urlsLocal:
	q = segno.make(url)
	q.save('url_local_' + str(i) + '.png', scale = 10)
	i += 1