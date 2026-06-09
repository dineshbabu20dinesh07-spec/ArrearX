import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

async def test_gemini():
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Hi Macha! Just testing if the API key works. Respond with 'API works da!' if you see this.")
        print("GENAI RESPONSE:")
        print(response.text)
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_gemini())
