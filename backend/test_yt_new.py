import asyncio

async def test_yt(q="engineering"):
    query = q + " engineering tamil Anna University"
    try:
        def fetch_yt():
            import urllib.request, urllib.parse, re, json
            req = urllib.request.Request(f'https://www.youtube.com/results?search_query={urllib.parse.quote(query)}', headers={'User-Agent': 'Mozilla/5.0'})
            html = urllib.request.urlopen(req).read().decode()
            results = []
            m = re.search(r'ytInitialData\s*=\s*({.+?});\s*</script>', html)
            if m:
                data = json.loads(m.group(1))
                contents = data['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents']
                for section in contents:
                    if 'itemSectionRenderer' in section:
                        for item in section['itemSectionRenderer']['contents']:
                            if 'videoRenderer' in item:
                                vid = item['videoRenderer']['videoId']
                                title = item['videoRenderer']['title']['runs'][0]['text']
                                thumb_url = f"https://img.youtube.com/vi/{vid}/mqdefault.jpg"
                                channel = item['videoRenderer'].get('ownerText', {}).get('runs', [{}])[0].get('text', '')
                                duration = item['videoRenderer'].get('lengthText', {}).get('simpleText', '')
                                views = item['videoRenderer'].get('viewCountText', {}).get('simpleText', '')
                                results.append({
                                    "id": vid,
                                    "title": title,
                                    "thumbnail": thumb_url,
                                    "channel": channel,
                                    "duration": duration,
                                    "views": views
                                })
            return results

        videos = await asyncio.to_thread(fetch_yt)
        print(f"[YT] Found {len(videos)} videos for query: {q}")
        return {"results": videos[:20]}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"results": [], "error": str(e)}

if __name__ == "__main__":
    import asyncio
    print(asyncio.run(test_yt("computer architecture")))
