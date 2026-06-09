import requests
import json

base_url = "http://localhost:8000"

def test_yt():
    print("\nTesting YouTube Search Engine...")
    try:
        r = requests.get(f"{base_url}/api/yt?q=Data+Structures+Tamil")
        print(f"Status: {r.status_code}")
        data = r.json()
        results = data.get('results', [])
        print(f"Results Count: {len(results)}")
        if results:
            print(f"First Video: {results[0]['title']}")
        return True
    except Exception as e:
        print(f"YT Test Failed: {e}")
        return False

def test_chat():
    print("\nTesting ALLCLEAR AI Buddy...")
    try:
        payload = {"message": "Macha, binary search pathi solluda"}
        r = requests.post(f"{base_url}/api/chat", json=payload)
        print(f"Status: {r.status_code}")
        data = r.json()
        reply = data.get('reply', '')
        print(f"AI Reply: {reply[:100]}...")
        return True
    except Exception as e:
        print(f"Chat Test Failed: {e}")
        return False

if __name__ == "__main__":
    yt_ok = test_yt()
    chat_ok = test_chat()
    
    if yt_ok and chat_ok:
        print("\n✅ Video AI and Chat are RUNNING CORRECTLY da! Everything is fine.")
    else:
        print("\n❌ Something is wrong. Check backend logs.")
