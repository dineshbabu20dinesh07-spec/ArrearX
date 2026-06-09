# ArrearX (ClearPath AI) - Hackathon Pitch Document

## 1. Problem Statement
Many engineering students struggle to clear their arrear (backlog) exams due to an overwhelming syllabus, lack of proper guidance, and high stress levels. Traditional studying methods ask them to "study everything," which is inefficient for a student who simply needs to clear the exam to progress.

## 2. Solution
**ArrearX (ClearPath AI)** is an AI-powered study platform focused strictly on helping engineering students pass their exams without the stress of reading the full syllabus. It employs selective AI-based learning, predicting important topics based on past questions and providing friendly, localized (Tamil/English) AI assistance.

## 3. Target Users
* Engineering students with existing arrears.
* Students facing immediate exams (last-minute preparation).
* Students who prefer vernacular (Tamil) explanations for complex engineering concepts.

## 4. Key Features
* **Smart Syllabus Filtering:** AI scans the university syllabus and uploaded PDFs to extract only the most crucial topics.
* **Question Prediction:** Analyzes repeated questions from previous years to predict expected 2-mark and 16-mark questions.
* **AI Friend Assistant (Core USP):** A supportive chatbot that explains topics simply in Tamil/English and provides emotional support ("Stress ah iruka?").
* **Curated Video Content:** Automatically fetches the best YouTube explanation videos matching the student's current unit.
* **Daily Nudges:** Replaces strict timetables with friendly, achievable daily tasks.

## 5. Architecture
* **Frontend:** React (Vite), Tailwind CSS, Framer Motion (for dynamic UI).
* **Backend:** Python (FastAPI) for efficient AI routing.
* **AI Layer:** LangChain orchestrating OpenAI models (PDF Analyzer, Question Predictor, Friend Chat).
* **Database:** SQLite/PostgreSQL (structured data) & MongoDB or basic file storage for chat history/notes.

## 6. Tech Stack
* UI: React, Tailwind CSS
* API: FastAPI (Python)
* AI capability: OpenAI API, Langchain

## 7. Demo Flow
1. **Login & Setup**: User logs in with email and enters subject code (e.g., CS8392).
2. **Syllabus Sync**: Platform pre-loads or asks the user to upload Unit PDFs.
3. **Smart Dashboard**: Instead of full chapters, user sees "High Priority Topics" with an 80% pass probability flag.
4. **Learn & Chat**: User clicks a topic, watches a recommended video, and chats with the AI Friend if they don't understand the concept. User asks: "Binary tree puriyala da", AI replies simply in Tamil.
5. **Exam Kit Generation**: User downloads the AI-generated "Last Day Revision Notes" containing high-chance questions.

## 8. Impact
* Direct reduction in arrear graduation delays.
* Helps rural and Tamil medium students grasp concepts faster.
* Reduces exam-related depression and stress.

## 9. Future Scope
* Peer-to-peer group study connections.
* Mentor connect capabilities.
* AI-based mock test correction tracking.
