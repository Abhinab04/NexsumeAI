# 🚀 Nexsume.ai

<div align="center">
  <p><strong>Your Ultimate AI-Powered Career Copilot</strong></p>
  <p>Nexsume.ai is a comprehensive, full-stack application that leverages advanced AI to optimize your resume, prepare you for interviews, generate tailored cover letters, and track your job search journey all in one place.</p>
</div>

---

## ✨ Key Features

- 📄 **Smart Resume Optimization & Editor**: Upload your resume (PDF/DOCX) and a target job description. Nexsume analyzes them and provides an ATS score, missing keywords, and an interactive editor to build an ATS-friendly resume in seconds.
- ✉️ **AI Cover Letter Generator**: Automatically generate highly personalized, job-specific cover letters that match your resume's tone and the job's requirements.
- 🎤 **AI Mock Interviews**: Practice your interviewing skills with our AI interviewer. Get real-time feedback on your answers based on the role you are applying for.
- 🗺️ **Skill Roadmaps**: Discover the gaps in your skillset for your target roles. Get AI-generated, step-by-step learning roadmaps to upskill efficiently.
- 📊 **Job Application Tracker**: Keep your job search organized. Track applications, interview stages, and follow-ups in a beautiful Kanban-style dashboard.
- 🕒 **Resume Versioning & History**: Never lose a good resume. Save multiple versions of your resume tailored for different jobs and access them anytime.
- 🔐 **Secure Authentication**: Seamless and secure sign-in and user management powered by Clerk.

## 🛠️ Tech Stack

Nexsume is built using a modern decoupled Monorepo architecture to ensure scalability, type safety, and a premium user experience.

### 💻 Frontend
- **Framework:** React 18 + Vite (Lightning-fast HMR and optimized builds)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Utility-first, Dark mode support)
- **Animations:** Framer Motion (`motion/react`) for smooth micro-interactions
- **Routing:** React Router v6
- **State & Data Fetching:** Axios with interceptors for secure API calls
- **Authentication:** Clerk (`@clerk/clerk-react`)

### ⚙️ Backend
- **Runtime & Framework:** Node.js + Express
- **Language:** TypeScript
- **AI Integration:** Google GenAI SDK (`@google/genai`) using the `gemini-3.6-flash` model for intelligent parsing, scoring, and text generation.
- **Document Parsing:** 
  - `multer` (multipart/form-data handling)
  - `pdf-parse` (PDF extraction)
  - `mammoth` (DOCX extraction)
- **Security:** `@clerk/express` (JWT validation), `helmet` (HTTP security headers), `express-rate-limit`, `cors`
- **Logging:** `pino` & `pino-http` (High-performance JSON logging)
- **Email/Notifications:** `nodemailer`

---

## 📁 Directory Structure

```text
NexsumeAI/
├── frontend/                 # React Vite Application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Feature pages (Dashboard, Editor, MockInterview, etc.)
│   │   ├── types/            # TypeScript interfaces
│   │   ├── lib/              # Utility functions
│   │   └── App.tsx           # Router and App Providers
│   └── package.json
│
└── backend/                  # Node.js Express Server
    ├── src/
    │   ├── api/              # Core business logic & controllers
    │   │   ├── auth/         # Authentication endpoints
    │   │   ├── coverLetter/  # Cover Letter Generation API
    │   │   ├── jobTracker/   # Job Tracking API
    │   │   ├── mockInterview/# AI Mock Interview API
    │   │   ├── resumeVersion/# Resume History API
    │   │   ├── skillRoadmap/ # Learning Roadmap API
    │   │   └── user/         # User profile management
    │   ├── common/           # Middleware, utils, and AI integration logic
    │   └── server.ts         # Express app initialization
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Clerk](https://clerk.dev/) account for authentication keys
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Abhinab04/NexsumeAI.git
cd NexsumeAI
```

### 2. Environment Variables Setup

You will need to configure environment variables for both the frontend and backend.

**Frontend (`frontend/.env`):**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:8080
```

**Backend (`backend/.env`):**
```env
PORT=8080
CORS_ORIGIN=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_smtp_email@example.com
EMAIL_PASS=your_smtp_password
```

### 3. Install Dependencies & Run

You can run both the frontend and backend concurrently from the root directory using the setup scripts.

```bash
# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install
cd ..

# Run both servers concurrently from the root
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:8080](http://localhost:8080)

---

## ☁️ Deployment

- **Frontend:** Optimized for deployment on Vercel or Render. Ensure you add a Rewrite rule (`Source: /*`, `Destination: /index.html`) to support React Router SPA navigation.
- **Backend:** Deploy as a Node Web Service (e.g., on Render or Railway). Requires environment variables to be set in the deployment dashboard.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
