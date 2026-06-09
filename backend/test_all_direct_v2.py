import asyncio
from main import search_youtube_videos, chat_with_ai, ChatRequest
import warnings
warnings.filterwarnings('ignore')

async def test_all():
    res = ""
    res += "Testing YT search...\n"
    try:
        yt_res = await search_youtube_videos("Data Structures")
        res += f"YT Found: {len(yt_res.get('results', []))} videos\n"
        if yt_res.get('results'):
            res += f"First Video: {yt_res['results'][0].get('title')}\n"
    except Exception as e:
        res += f"YT Error: {e}\n"
    
    res += "\nTesting AI Chat...\n"
    try:
        chat_req = ChatRequest(message="Macha, binary search pathi solluda")
        chat_res = await chat_with_ai(chat_req)
        res += f"AI Reply: {str(chat_res)[:200]}...\n"
    except Exception as e:
        res += f"Chat Error: {e}\n"
        
    with open("python_test_out.txt", "w", encoding="utf-8") as f:
        f.write(res)

if __name__ == "__main__":
    asyncio.run(test_all())
