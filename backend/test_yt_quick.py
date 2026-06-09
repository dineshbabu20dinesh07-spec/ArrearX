import requests
r = requests.get('http://localhost:8000/api/yt?q=Data+Structures+Tamil')
print('Status:', r.status_code)
data = r.json()
print('Results count:', len(data.get('results', [])))
for v in data.get('results', []):
    print(f"  - {v['title'][:60]}")
if 'error' in data:
    print('Error:', data['error'])
