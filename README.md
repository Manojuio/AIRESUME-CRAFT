# AI Resume Craft 🚀

Transform your GitHub profile into a professionally optimized resume powered by AI.

## Features

- 📊 **GitHub Analysis**: Automatically fetch and analyze your repositories
- 🤖 **AI-Powered**: Generate professional resume content using Groq's LLaMA 3.3-70B
- 📈 **ATS Optimization**: Check resume compatibility against job descriptions
- 📥 **Multiple Formats**: Download as PDF, DOCX, or HTML Portfolio
- ✏️ **Easy Editing**: Edit resume content before downloading
- 🎨 **Modern UI**: Beautiful dark gradient design with animations

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key ([Get it here](https://console.groq.com))

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY to .env

uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3001** to access the app.

## Usage

1. Enter your GitHub username
2. (Optional) Add personal summary or job description
3. Click "Generate Resume"
4. Edit and customize your resume
5. Download in your preferred format

## Tech Stack

**Backend**: FastAPI, Groq API, Python  
**Frontend**: React, Vite, Tailwind CSS  
**Export**: DOCX, PDF, HTML

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Start resume generation |
| GET | `/status/{task_id}` | Check generation progress |
| POST | `/update/{task_id}` | Update resume data |
| GET | `/download/{task_id}/{type}` | Download generated file |

## Environment Variables

Create `.env` in the backend directory:
```
LLM_PROVIDER=groq
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## Project Structure

```
├── backend/              # FastAPI server
│   ├── main.py          # App & routes
│   ├── agent.py         # Resume generation logic
│   ├── llm_client.py    # Groq integration
│   ├── github_fetcher.py # GitHub API
│   ├── ats.py           # ATS scoring
│   └── renderer.py      # PDF/DOCX rendering
│
├── frontend/            # React SPA
│   └── src/
│       ├── App.jsx
│       ├── components/
│       └── api.js
```

## How It Works

1. Fetches your GitHub public repositories
2. Analyzes repositories and selects top 5
3. Generates professional resume sections
4. Calculates ATS score against job description
5. Exports in multiple formats

## License

MIT

---

**Made with ❤️ using Groq AI, React & FastAPI**
