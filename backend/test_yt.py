import urllib.parse
import urllib.request
import re

def search(q):
    query = q + " engineering tamil Anna University"
    encoded_search = urllib.parse.quote(query)
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(f"https://www.youtube.com/results?search_query={encoded_search}", headers=headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode()
            
            # Using watch?v= (current approach in main.py)
            video_ids = re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)
            print("Old regex unique ids:", list(dict.fromkeys(video_ids))[:6])

            # Try finding videoId string in YouTube's json data within html
            new_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
            print("New regex unique ids:", list(dict.fromkeys(new_ids))[:6])
    except Exception as e:
        print("Error:", e)

search('engineering mechanics')
