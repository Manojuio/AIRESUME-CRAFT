# ✨ AI Resume Craft

An intelligent AI-powered resume generator that transforms your GitHub profile into a professionally crafted resume with ATS optimization.

## 🚀 Features

- **GitHub Profile Analysis**: Automatically fetches and analyzes your GitHub repositories
- **AI-Powered Content Generation**: Uses Groq's LLaMA 3.3-70B model to generate professional resume content
- **ATS Score Optimization**: Analyzes job descriptions and provides ATS compatibility scores
- **Multiple Export Formats**: Download your resume as PDF, DOCX, or HTML portfolio
- **Real-time Editing**: Edit and customize your resume before downloading
- **Modern UI**: Beautiful gradient-based dark theme with smooth animations

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Groq API** - Advanced AI model for content generation
- **Python 3.11+** - Backend runtime
- **AsyncIO** - Asynchronous operations
- **Jinja2** - Template rendering
- **python-docx** - DOCX generation

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 18+ and npm
- Groq API Key (get it at https://console.groq.com)
- GitHub username (public profile)

## 🔧 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/airesume-craft.git
cd airesume-craft
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your Groq API Key
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
source venv/Scripts/activate  # On Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: **http://localhost:8000**

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:3001** (or the port shown in terminal)

## 📖 Usage

1. Open http://localhost:3001 in your browser
2. Enter your GitHub username
3. (Optional) Add a GitHub token for higher API rate limits
4. (Optional) Add a personal summary and job description
5. Click "Generate Resume"
6. Edit your resume content as needed
7. Download in your preferred format (PDF, DOCX, or Portfolio HTML)

## 🤖 How It Works

1. **GitHub Data Fetching**: Retrieves all public repositories from the specified GitHub user
2. **Repository Selection**: Uses AI to select the 5 most relevant repositories based on the job description
3. **Content Generation**: Generates professional resume sections using Groq's LLaMA model
4. **ATS Analysis**: Compares resume against job description to identify missing keywords
5. **Rendering**: Creates downloadable files in multiple formats

## 📊 API Endpoints

### POST `/generate`
Initiates resume generation for a GitHub user.
```json
{
  "github_username": "octocat",
  "personal_token": "ghp_...",
  "personal_summary": "...",
  "job_description": "..."
}
```

### GET `/status/{task_id}`
Gets the current status of a generation task.

### POST `/update/{task_id}`
Updates resume data and re-renders files.

### GET `/download/{task_id}/{file_type}`
Downloads the generated file (pdf, docx, or portfolio.html).

## 🎨 UI Features

- **Dark Gradient Theme**: Modern slate-to-blue gradient background
- **Glass Morphism**: Frosted glass effect cards with backdrop blur
- **Smooth Animations**: Transitions and progress indicators
- **Responsive Design**: Works on desktop and tablet
- **Real-time Progress**: Live generation progress tracking

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```
LLM_PROVIDER=groq
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## 📝 Project Structure

```
airesume-craft/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── agent.py             # Core resume generation logic
│   ├── llm_client.py        # Groq API integration
│   ├── github_fetcher.py    # GitHub API integration
│   ├── ats.py               # ATS scoring engine
│   ├── renderer.py          # PDF/DOCX rendering
│   ├── requirements.txt
│   ├── .env
│   ├── templates/
│   │   ├── resume.html
│   │   └── portfolio.html
│   └── generated/           # Generated resume files
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js           # Backend API calls
│   │   ├── index.css        # Tailwind styles
│   │   └── components/
│   │       ├── InputForm.jsx
│   │       ├── ProgressTracker.jsx
│   │       ├── ResumeEditor.jsx
│   │       ├── AtsScore.jsx
│   │       └── DownloadPanel.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Groq API for powerful AI models
- GitHub API for repository data
- Tailwind CSS for beautiful styling
- FastAPI for the excellent web framework

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ using AI and modern web technologies**
