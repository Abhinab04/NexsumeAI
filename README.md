# Nexsume.ai

Nexsume.ai is an AI-powered resume optimization tool that analyzes your resume against a target job description and generates an ATS-optimized, beautifully formatted resume in seconds.

## 🚀 Architecture Overview

Nexsume is built using a modern decoupled Monorepo-style architecture with a React frontend and a Node.js Express backend. 

### Frontend Architecture
- **Framework:** React 18 + Vite for lightning-fast HMR and optimized production builds.
- **Styling:** Tailwind CSS for utility-first styling and dark mode support.
- **Animations:** Framer Motion (`motion/react`) for smooth, fluid UI transitions and micro-interactions.
- **Routing:** React Router v6 for Single Page Application (SPA) navigation.
- **Authentication:** Clerk (`@clerk/clerk-react`) for secure, seamless SSO and user management.
- **State & Data Fetching:** Axios with interceptors for secure API calls to the backend, attaching Clerk Bearer tokens.

### Backend Architecture
- **Runtime:** Node.js + Express written in TypeScript for type safety.
- **AI Integration:** Google GenAI SDK (`@google/genai`) utilizing the `gemini-3.6-flash` model for intelligent resume parsing, ATS scoring, keyword extraction, and structural rewriting.
- **Document Parsing:** 
  - `multer` for handling multipart form data (large document uploads).
  - `pdf-parse` for extracting text from PDF resumes.
  - `mammoth` for extracting text from DOCX resumes.
- **Security & Middleware:**
  - `@clerk/express` for verifying JWT tokens sent from the frontend.
  - `helmet` for HTTP header security.
  - `express-rate-limit` for API abuse prevention.
  - `cors` restricted to the frontend origin.
- **Logging & Monitoring:** `pino` and `pino-http` for high-performance, structured JSON logging.
- **Email Service:** `nodemailer` connected to a secure SMTP service (e.g., Gmail) to handle contact form requests.

## 📁 Directory Structure

```text
NexsumeAI/
├── frontend/                 # React Vite Application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Upload, etc.)
│   │   ├── pages/            # Page-level components (Landing, Dashboard, Editor)
│   │   ├── types/            # TypeScript interfaces for Resume data structures
│   │   ├── lib/              # Utility functions and Tailwind mergers (clsx, twMerge)
│   │   └── App.tsx           # Main router and Clerk provider setup
│   └── package.json
│
└── backend/                  # Node.js Express Server
    ├── src/
    │   ├── api/              # Core API endpoints (Auth, User, Health)
    │   ├── common/           # Shared utilities
    │   │   ├── middleware/   # Multer, Pino logger, Error handling, Clerk auth
    │   │   └── utils/        # Gemini integration, PDF/DOCX parsing logic
    │   ├── routes/           # Feature routes (Resume Score, Generate PDF, Contact)
    │   └── server.ts         # Express app initialization and middleware pipeline
    └── package.json
```

## ⚙️ Environment Variables

To run this project locally, you will need to set up `.env` files in both the frontend and backend directories.

### Frontend (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:8080
```

### Backend (`backend/.env`)
```env
PORT=8080
CORS_ORIGIN=http://localhost:5173
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=AIzaSy...
EMAIL_USER=support@nexsume.ai
EMAIL_PASS=your-16-char-app-password
```

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhinab04/NexsumeAI.git
   cd NexsumeAI
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will start on `http://localhost:8080`.

3. **Start the Frontend:**
   ```bash
   # Open a new terminal window
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## 📦 Deployment Strategy

- **Frontend (Render/Vercel):** Deployed as a Static Site. 
  - *Crucial Setup:* A Rewrite rule must be added (`Source: /*`, `Destination: /index.html`, `Action: Rewrite`) to support React Router SPA routing after Clerk authentication redirects.
- **Backend (Render):** Deployed as a Node Web Service.
  - Ensures robust file parsing and AI generation in an isolated container.

## 🤝 Core Workflows

1. **Resume Analysis:** 
   - User uploads a Resume and Job Description.
   - Frontend sends a `multipart/form-data` request with a Clerk Auth token to the Backend.
   - Backend `multer` saves the files temporarily.
   - `pdf-parse` or `mammoth` extracts raw text.
   - The text is passed to Google Gemini 3.6 Flash with a strict prompt to return a structured JSON evaluation (ATS Score, Missing Keywords, Structural Improvements).
   - Backend returns the JSON to the frontend for visualization.

2. **Resume Generation/Editing:**
   - The AI-generated JSON populates an interactive Editor on the frontend.
   - Users can manually tweak AI suggestions.
   - Clicking "Save & Generate PDF" sends the final JSON structure back to the Backend's PDF Generator endpoint to compile a beautifully formatted PDF document.
