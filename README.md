# 🚀 Nexsume.ai

> AI-powered resume optimization and job application assistant.

Nexsume.ai helps job seekers tailor their resumes to specific job descriptions using AI. Upload your resume and a job description to receive an ATS match score, keyword analysis, improvement suggestions, and an optimized resume.

---

## ✨ Features

- 📄 **Resume Upload**
  - Upload your existing resume in PDF format.
  - Extract resume content automatically.

- 💼 **Job Description Analysis**
  - Upload a job description.
  - Analyze the requirements and important keywords.

- 🤖 **AI Resume Optimization**
  - Uses Google Gemini to analyze and optimize resume content.
  - Rewrites content while avoiding fabricated skills or experience.

- 📊 **ATS Match Score**
  - Analyze how closely your resume matches the job description.
  - Identify matched and missing keywords.

- 🔑 **Keyword Analysis**
  - Matched keywords
  - Missing keywords
  - Keyword-based recommendations

- ✍️ **Resume Improvements**
  - Action-oriented writing suggestions.
  - Buzzword replacements.
  - Key improvement recommendations.

- 🧠 **Learning Roadmap**
  - Identify skills and topics that may be useful based on the target job description.

- 📝 **Structured Resume**
  - Personal information
  - Summary
  - Education
  - Experience
  - Skills
  - Projects

- 👀 **Resume Preview**
  - Compare the original resume with the optimized version.
  - Review changes before downloading.

- 📑 **PDF Generation**
  - Generate a formatted PDF version of the optimized resume.

- 🔐 **Authentication**
  - User authentication powered by Clerk.

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion / Motion
- Axios
- Clerk

## Backend

- Node.js
- Express.js
- TypeScript
- Multer
- PDF parsing
- EJS
- REST APIs

## AI

- Google Gemini
- `@google/genai`

## Database

- MongoDB
- Mongoose

## Other Tools

- Docker
- Git
- GitHub
- Postman

---

# 📁 Project Structure

```text
Nexsume.ai/
│
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   │
│   │   ├── routes/
│   │   ├── templates/
│   │   ├── config/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── .env
│
├── package.json
├── docker-compose.yml
├── LICENSE.md
└── README.md