import urllib.request, urllib.parse, re, json

q = 'engineering mechanics tamil Anna University'
req = urllib.request.Request(f'https://www.youtube.com/results?search_query={urllib.parse.quote(q)}', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode()

# The json might have videoRenderer objects
results = []
try:
    # Try parsing ytInitialData
    m = re.search(r'ytInitialData\s*=\s*({.+?});\s*</script>', html)
    if m:
        data = json.loads(m.group(1))
        contents = data['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents']
        for item in contents:
            if 'videoRenderer' in item:
                vid = item['videoRenderer']['videoId']
                title = item['videoRenderer']['title']['runs'][0]['text']
                results.append((vid, title))
except Exception as e:
    print(e)
print(results[:5])
