# 🏆 TruthLens AI – AI Hallucination Detection System

**ByteQuest Hackathon 2025 – AI/ML Project**

TruthLens AI is an AI-powered hallucination detection and citation verification system designed to analyze AI-generated or human-written content and assess its factual reliability.

---

## 🎯 Problem Statement

As large language models are increasingly used in education, research, journalism, and decision-making, the risk of hallucinated or misleading information has grown significantly. Existing systems lack a transparent and automated way to verify AI-generated claims.

---

## 💡 Solution Overview

TruthLens AI provides a verification layer that:
- Breaks text into individual claims  
- Analyzes each claim using ML-based techniques  
- Assigns confidence scores and hallucination risk  
- Produces an overall trustworthiness assessment  

---

## 🚀 Features

- Real-time hallucination detection  
- Claim-by-claim analysis  
- Confidence scoring per claim  
- Risk levels: **Low / Medium / High**  
- FastAPI-powered backend  
- React (Vite) frontend dashboard  

---

## 🏗️ Architecture

Frontend (React + Vite)
│
▼
Backend API (FastAPI)
│
▼
ML Analysis Engine

yaml
Copy code

---

## 🧠 Machine Learning Approach

TruthLens AI uses an ensemble-based approach combining:
- Linguistic pattern analysis  
- Semantic consistency checks  
- Factual verification heuristics  

The architecture is designed to support future integration with advanced NLP models and external fact-checking APIs.

---

## 🧪 API Endpoints

- `POST /verify` – Analyze and verify content  
- `GET /health` – API health check  
- `GET /stats` – Platform statistics  
- `GET /model-info` – ML model details  
- `GET /docs` – Swagger API documentation  

---

## ⚙️ Tech Stack

### Frontend
- React 18
- Vite
- JavaScript
- CSS

### Backend
- Python 3.11
- FastAPI
- Pydantic
- Uvicorn

---

## 🎯 Use Cases

- Students & Researchers  
- Journalists & Media  
- Content Creators  
- AI Developers  
- Hackathons & Academic Projects  

---

## 📁 Project Structure

truthlens-ai/
├── frontend/
│ ├── src/
│ └── index.html
├── backend/
│ ├── main.py
│ ├── ml_model.py
│ └── requirements.txt
└── README.md

yaml
Copy code

---

## 📝 License

MIT License

---

## 👤 Author

**Ayisetti Lalita Gayatri**  
ByteQuest Hackathon 2025 Participant  

---

⭐ Star this repository if you find it useful!