import asyncio
from main import search_youtube_videos

async def test_all():
    queries = ["engineering", "machine learning tamil", "computer networks anna university", "Data Structures"]
    for q in queries:
        print(f"Testing YT: '{q}'")
        try:
            res = await search_youtube_videos(q)
            if 'error' in res:
                print(f"ERROR returned: {res['error']}")
            else:
                print(f"Success: {len(res.get('results', []))} videos")
                if len(res.get('results', [])) == 0:
                    print("  -> BUT 0 videos found!!!")
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    asyncio.run(test_all())
