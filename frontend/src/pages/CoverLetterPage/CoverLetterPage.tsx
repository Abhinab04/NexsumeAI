import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IconWand, IconCopy, IconDownload, IconHistory } from "@tabler/icons-react";

interface CoverLetter {
  _id: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  content: string;
  tone: string;
  createdAt: string;
}

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [resumeContent, setResumeContent] = useState("");
  
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const [history, setHistory] = useState<CoverLetter[]>([]);

  useEffect(() => {
    // Attempt to load resume content from user's latest resume or allow them to paste
    // For now, let's keep it as an editable text area if they want to paste, 
    // or we could fetch it.
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/features/cover-letter");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setHistory(data.responseObject);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!jobTitle || !companyName || !resumeContent) {
      toast.error("Please fill in Job Title, Company Name, and Resume Content");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/features/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          companyName,
          jobDescription,
          tone,
          resumeContent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedLetter(data.responseObject.content);
        toast.success("Cover letter generated!");
        fetchHistory(); // refresh history
      } else {
        toast.error(data.message || "Failed to generate");
      }
    } catch (err) {
      toast.error("An error occurred during generation");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success("Copied to clipboard!");
  };

  const exportPDF = () => {
    // Need a PDF export library or an API endpoint. 
    // For now, we will just use window.print() as a simple workaround or trigger a toast.
    toast.info("PDF Export coming soon. Please copy the text for now.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            AI Cover Letter
          </h1>
          <p className="text-neutral-400 mt-2">Generate a personalized cover letter in seconds.</p>
        </div>
        <button
          onClick={() => setHistoryMode(!historyMode)}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition"
        >
          <IconHistory className="w-5 h-5" />
          {historyMode ? "Back to Generator" : "View History"}
        </button>
      </div>

      {historyMode ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.length === 0 ? (
            <div className="col-span-full text-center py-20 text-neutral-500">
              No cover letters generated yet.
            </div>
          ) : (
            history.map((letter) => (
              <div key={letter._id} className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                <h3 className="font-semibold text-lg">{letter.jobTitle}</h3>
                <p className="text-indigo-400 text-sm mb-4">{letter.companyName}</p>
                <div className="text-sm text-neutral-400 mb-4 line-clamp-4">
                  {letter.content}
                </div>
                <button
                  onClick={() => {
                    setGeneratedLetter(letter.content);
                    setHistoryMode(false);
                  }}
                  className="text-sm bg-neutral-800 px-3 py-1 rounded hover:bg-neutral-700 transition"
                >
                  View Full
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6 bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. Google"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Your Resume Content *</label>
              <textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                rows={5}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
                placeholder="Paste your resume text here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
              >
                <option value="Professional">Professional</option>
                <option value="Enthusiastic">Enthusiastic</option>
                <option value="Formal">Formal</option>
                <option value="Concise">Concise</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium p-3 rounded-lg transition"
            >
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <IconWand className="w-5 h-5" /> Generate Cover Letter
                </>
              )}
            </button>
          </div>

          {/* Result Area */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Result</h2>
              {generatedLetter && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-neutral-300">
                    <IconCopy className="w-5 h-5" />
                  </button>
                  <button onClick={exportPDF} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-neutral-300">
                    <IconDownload className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 bg-black border border-neutral-800 rounded-2xl p-6 relative">
              {generatedLetter ? (
                <textarea
                  value={generatedLetter}
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  className="w-full h-full min-h-[500px] bg-transparent text-neutral-200 outline-none resize-none leading-relaxed"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600">
                  <IconWand className="w-16 h-16 mb-4 opacity-50" />
                  <p>Your AI-generated cover letter will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
