import asyncio
from main import search_youtube_videos, chat_with_ai, ChatRequest
import sys
# to avoid encoding issues with print on Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

async def test_all():
    print("Testing YT search...")
    try:
        yt_res = await search_youtube_videos("Data Structures")
        print(f"YT Found: {len(yt_res.get('results', []))} videos")
        if yt_res.get('results'):
            print(f"First Video: {yt_res['results'][0].get('title')}")
    except Exception as e:
        print("YT Error:", e)
    
    print("\nTesting AI Chat...")
    try:
        chat_req = ChatRequest(message="Macha, binary search pathi solluda")
        chat_res = await chat_with_ai(chat_req)
        print("AI Reply:", chat_res)
    except Exception as e:
        print("Chat Error:", e)

if __name__ == "__main__":
    asyncio.run(test_all())
