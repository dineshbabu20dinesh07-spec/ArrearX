import os
import re
import json
import base64
import asyncio
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from groq import Groq
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from bson import ObjectId
from database import chat_collection, client

# Load Environment Variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
AI_MODEL_NAME = os.getenv("AI_MODEL", "gemini-1.5-flash")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# Configure Gemini
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
else:
    print("WARNING: GOOGLE_API_KEY or GEMINI_API_KEY not found in environment!")

# Configure Groq
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
else:
    groq_client = None
    print("WARNING: GROQ_API_KEY not found in .env!")

# Configure Anthropic
if ANTHROPIC_API_KEY:
    anthropic_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
else:
    anthropic_client = None
    print("WARNING: ANTHROPIC_API_KEY not found in .env!")

# Configure DeepSeek via OpenAI SDK
if DEEPSEEK_API_KEY:
    deepseek_client = AsyncOpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")
else:
    deepseek_client = None
    print("WARNING: DEEPSEEK_API_KEY not found in .env!")

app = FastAPI(title="ALLCLEAR API", description="ALLCLEAR AI Core (Gemini Flash Mode)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load subjects database
SUBJECTS_FILE = os.path.join(os.path.dirname(__file__), "subjects.json")
try:
    if os.path.exists(SUBJECTS_FILE):
        with open(SUBJECTS_FILE, "r") as f:
            subjects_db = json.load(f)
    else:
        subjects_db = []
except Exception:
    subjects_db = []

# ── Models ──────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "gemini" # Default to gemini
    image_b64: Optional[str] = None
    custom_keys: Optional[dict] = None

class NoteRequest(BaseModel):
    title: str
    content: str
    subject: str = ""

class SyllabusRequest(BaseModel):
    image_b64: str

# ── Gemini Helper (Direct SDK) ──────────────────────────────────────────────
async def call_gemini(prompt: str, image_b64: Optional[str] = None):
    try:
        model = genai.GenerativeModel(AI_MODEL_NAME)
        
        if image_b64:
            # Process with Image
            image_data = base64.b64decode(image_b64)
            response = await asyncio.to_thread(
                model.generate_content,
                [prompt, {"mime_type": "image/jpeg", "data": image_data}]
            )
        else:
            # Text only
            response = await asyncio.to_thread(model.generate_content, prompt)
            
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return f"An error occurred while communicating with the Gemini API. Please check your connection and configuration. Details: {str(e)}"

# ── Roots ────────────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "Welcome to ArrearX AI Platform (Gemini Flash Mode)!"}

@app.get("/api/chat")
async def test_chat():
    return {"message": "Chat endpoint is alive! Use POST to talk to AI."}

# ── Chat Endpoint (The Ultimate Buddy) ────────────────────────────────────────
@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    import urllib.parse
    
    user_msg = request.message
    selected_model = request.model
    image_b64 = request.image_b64
    
    # Detect if user is requesting an image to be generated
    user_msg_lower = user_msg.lower()
    image_keywords = ["generate image", "generate an image", "create an image", "draw", "picture of", "image of"]
    is_image_request = any(kw in user_msg_lower for kw in image_keywords)
    
    ai_generated_image_url = None
    if is_image_request:
        encoded_prompt = urllib.parse.quote(user_msg)
        ai_generated_image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=800&nologo=true"
    
    # Professional Academic Assistant System Prompt with Agent Tools
    system_prompt = (
        "You are 'ArrearX Academic Assistant', an expert and supportive engineering tutor. "
        "Your goal is to help students understand complex engineering concepts, study effectively, "
        "and clear their academic arrears with excellent performance. "
        "Maintain a highly professional, encouraging, and academically structured tone. "
        "Speak in professional English, but if the student asks or references Tamil terms, "
        "you can provide localized explanations. "
        "\n\n*** AGENT CAPABILITIES ***\n"
        "You have access to the following tool to fetch real-world data:\n"
        "1. search_youtube(query: str): Searches YouTube for video tutorials. Use this if the user asks for videos, tutorials, or visual explanations.\n\n"
        "To use the tool, you MUST output exactly this text and nothing else:\n"
        "[CALL_TOOL: search_youtube(\"your search query\")]\n\n"
        "If you use a tool, the system will reply with the results. You must then formulate your final answer using those results. Always include the video URLs (https://youtube.com/watch?v=...) in your final answer so the user can click them."
    )
    
    if is_image_request:
        system_prompt += "\nThe user has requested an image. Briefly acknowledge that you are generating the requested image and provide a short description of what you are 'drawing'."

    # --- Helper to invoke selected model ---
    async def invoke_llm(current_prompt: str, current_image: Optional[str]) -> str:
        if selected_model == "grok" or selected_model == "groq":
            custom_groq_key = request.custom_keys.get("grok", "") if request.custom_keys else ""
            active_client = Groq(api_key=custom_groq_key) if custom_groq_key else groq_client
            
            if not active_client:
                return "Groq/Grok API key is not configured."
            chat_completion = await asyncio.to_thread(
                active_client.chat.completions.create,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": current_prompt}
                ],
                model="llama3-70b-8192",
            )
            return chat_completion.choices[0].message.content
            
        elif selected_model == "claude":
            custom_claude_key = request.custom_keys.get("claude", "") if request.custom_keys else ""
            active_client = AsyncAnthropic(api_key=custom_claude_key) if custom_claude_key else anthropic_client
            
            if not active_client:
                return "Anthropic API key is not configured in .env or settings!"
            messages_payload = [{"role": "user", "content": []}]
            if current_image:
                messages_payload[0]["content"].append({
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/jpeg", "data": current_image}
                })
            messages_payload[0]["content"].append({"type": "text", "text": current_prompt})
            
            response = await active_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                system=system_prompt,
                messages=messages_payload
            )
            return response.content[0].text
            
        elif selected_model == "deepseek":
            custom_deepseek_key = request.custom_keys.get("deepseek", "") if request.custom_keys else ""
            active_client = AsyncOpenAI(api_key=custom_deepseek_key, base_url="https://api.deepseek.com") if custom_deepseek_key else deepseek_client
            
            if not active_client:
                return "DeepSeek API key is not configured in .env or settings!"
            response = await active_client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": current_prompt}
                ],
                max_tokens=1024
            )
            return response.choices[0].message.content
            
        else:
            # Default to Gemini
            custom_gemini_key = request.custom_keys.get("gemini", "") if request.custom_keys else ""
            if custom_gemini_key:
                genai.configure(api_key=custom_gemini_key)
                res = await call_gemini(f"{system_prompt}\n\n{current_prompt}", current_image)
                if GOOGLE_API_KEY: genai.configure(api_key=GOOGLE_API_KEY)
                return res
            else:
                return await call_gemini(f"{system_prompt}\n\n{current_prompt}", current_image)

    # --- The Agent Loop ---
    import re
    conversation_history = f"Student says: {user_msg}"
    final_reply = ""
    
    try:
        for step in range(3): # Max 3 reasoning steps
            reply = await invoke_llm(conversation_history, image_b64 if step == 0 else None)
            
            # Check if AI wants to use a tool
            tool_match = re.search(r'\[CALL_TOOL:\s*search_youtube\("([^"]+)"\)\]', reply)
            if tool_match:
                query = tool_match.group(1)
                print(f"[AGENT] Executing Tool: search_youtube for '{query}'")
                
                # Fetch videos
                yt_data = await search_youtube_videos(query)
                results_list = yt_data.get("results", [])[:3] # Limit to 3 to save context
                
                if results_list:
                    formatted_results = "\n".join([f"- Title: {v['title']} (https://youtube.com/watch?v={v['id']})" for v in results_list])
                else:
                    formatted_results = "No videos found."
                    
                tool_feedback = f"\n\nAssistant Action: {reply}\nSystem Tool Result:\n{formatted_results}\n\nNow, provide your final answer to the student."
                conversation_history += tool_feedback
                continue # Loop again so AI can process the tool results
            else:
                # No tool called, this is the final answer
                final_reply = reply
                break
    except Exception as e:
        print(f"Chat API Error: {e}")
        final_reply = f"Error communicating with {selected_model}: {str(e)}"
    
    reply = final_reply

    # Save to MongoDB asynchronously
    try:
        await chat_collection.insert_one({
            "user_message": user_msg,
            "ai_response": reply,
            "ai_image": ai_generated_image_url,
            "timestamp": datetime.utcnow()
        })
    except:
        pass

    return {"reply": reply, "ai_image": ai_generated_image_url}

# ── Syllabus Vision Endpoint (X-Ray Vision) ───────────────────────────────────
@app.post("/api/analyze-syllabus")
async def analyze_syllabus(req: SyllabusRequest):
    try:
        prompt = """Analyze this Anna University syllabus image. Extract units and topics.
Format strictly as JSON:
{
  "units": [
    {
      "unit_number": 1,
      "unit_title": "Unit title",
      "topics": ["topic1"],
      "two_mark_questions": ["Q?"],
      "fourteen_mark_questions": ["Big Q?"],
      "important_topics": ["Core Topic"]
    }
  ]
}"""
        raw = await call_gemini(prompt, req.image_b64)
        
        # Extract JSON from potential wrapper text (Gemini sometimes adds ```json)
        json_match = re.search(r'\{.*\}', raw, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            return json.loads(raw)

    except Exception as e:
        return {"error": f"Syllabus analysis failed: {str(e)}", "units": []}

# ── Notes & Subjects Hub ──────────────────────────────────────────────────────
NOTES_FILE = os.path.join(os.path.dirname(__file__), "notes.json")

def _load_notes():
    if os.path.exists(NOTES_FILE):
        with open(NOTES_FILE, "r") as f:
            return json.load(f)
    return []

def _save_notes(notes):
    with open(NOTES_FILE, "w") as f:
        json.dump(notes, f, indent=4)

@app.post("/api/notes")
async def save_note(note: NoteRequest):
    try:
        import uuid
        notes = _load_notes()
        new_note = {
            "id": str(uuid.uuid4()),
            "title": note.title,
            "content": note.content,
            "subject": note.subject,
            "created_at": datetime.utcnow().isoformat()
        }
        notes.append(new_note)
        _save_notes(notes)
        return {"success": True, "id": new_note["id"]}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.put("/api/notes/{note_id}")
async def update_note(note_id: str, note: NoteRequest):
    try:
        notes = _load_notes()
        for idx, n in enumerate(notes):
            if n["id"] == note_id:
                notes[idx]["title"] = note.title
                notes[idx]["content"] = note.content
                notes[idx]["subject"] = note.subject
                notes[idx]["updated_at"] = datetime.utcnow().isoformat()
                _save_notes(notes)
                return {"success": True}
        return {"success": False, "error": "Note not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: str):
    try:
        notes = _load_notes()
        updated_notes = [n for n in notes if n["id"] != note_id]
        if len(notes) != len(updated_notes):
            _save_notes(updated_notes)
            return {"success": True}
        return {"success": False, "error": "Note not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/notes")
async def get_notes():
    try:
        notes = _load_notes()
        notes.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return {"notes": notes}
    except:
        return {"notes": []}

@app.get("/api/subjects/search")
async def search_subjects(q: str):
    query = q.lower()
    results = [s for s in subjects_db if query in s["code"].lower() or query in s["name"].lower()]
    return {"results": results[:10]}

@app.get("/api/subjects/{code}")
async def get_subject_by_code(code: str):
    code_upper = code.upper()
    for s in subjects_db:
        if s["code"] == code_upper: return s
    return {"error": "Subject not found"}

@app.get("/api/yt")
async def search_youtube_videos(q: str = "engineering"):
    import asyncio
    
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
