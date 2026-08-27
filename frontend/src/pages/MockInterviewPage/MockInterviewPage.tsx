import { useState } from "react";
import { toast } from "sonner";
import { IconMicrophone, IconPlayerPlay, IconCheck, IconHistory, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export default function MockInterviewPage() {
  const [step, setStep] = useState<"setup" | "interview" | "results" | "history">("setup");
  
  // Setup state
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState("HR / Behavioral");
  const [difficulty, setDifficulty] = useState("Intermediate");

  // Interview state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  // Results state
  const [sessionResults, setSessionResults] = useState<any>(null);
  
  // History
  const [history, setHistory] = useState<any[]>([]);

  const startSession = async () => {
    if (!resumeContent || !targetRole || !jobDescription) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/features/mock-interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent, jobDescription, targetRole, interviewType, difficulty }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessionId(data.responseObject._id);
        fetchNextQuestion(data.responseObject._id);
        setStep("interview");
      } else {
        toast.error("Failed to start session");
      }
    } catch (err) {
      toast.error("Error starting session");
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async (sid: string) => {
    setLoading(true);
    setEvaluation(null);
    setAnswer("");
    try {
      const res = await fetch(`/api/features/mock-interview/${sid}/next-question`);
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentQuestion(data.responseObject);
      }
    } catch (err) {
      toast.error("Failed to fetch question");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !sessionId || !currentQuestion) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/features/mock-interview/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: currentQuestion._id, answer }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvaluation(data.responseObject);
      }
    } catch (err) {
      toast.error("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/features/mock-interview/${sessionId}/complete`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        loadResults(sessionId);
      }
    } catch (err) {
      toast.error("Failed to complete session");
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (sid: string) => {
    try {
      const res = await fetch(`/api/features/mock-interview/${sid}/result`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSessionResults(data.responseObject);
        setStep("results");
      }
    } catch (err) {
      toast.error("Failed to load results");
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/features/mock-interview/history");
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory(data.responseObject);
        setStep("history");
      }
    } catch(err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            AI Mock Interview
          </h1>
          <p className="text-neutral-400 mt-2">Practice for your next big role with our AI interviewer.</p>
        </div>
        {step !== "history" && (
          <button
            onClick={fetchHistory}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition"
          >
            <IconHistory className="w-5 h-5" /> View History
          </button>
        )}
        {step === "history" && (
          <button
            onClick={() => setStep("setup")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            New Interview
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8"
          >
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                  >
                    <option>HR / Behavioral</option>
                    <option>Technical</option>
                    <option>Scenario-based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-neutral-400 mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here"
                rows={4}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm text-neutral-400 mb-2">Resume Content</label>
              <textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                placeholder="Paste your resume text here"
                rows={5}
                className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={startSession}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition"
            >
              {loading ? "Initializing Interview..." : <><IconPlayerPlay className="w-5 h-5" /> Start Interview</>}
            </button>
          </motion.div>
        )}

        {step === "interview" && currentQuestion && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-[70vh]"
          >
            <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-t-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">
                  Q{currentQuestion.questionNumber}
                </div>
                <span className="font-medium text-neutral-300">Live Interview</span>
              </div>
              <button
                onClick={completeSession}
                className="text-sm bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition"
              >
                End Interview
              </button>
            </div>

            <div className="bg-black border-x border-neutral-800 flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8">
              {/* Question Bubble */}
              <div className="flex gap-4 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center">
                  <IconMicrophone className="w-4 h-4 text-white" />
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-sm p-4 text-neutral-200">
                  {currentQuestion.questionText}
                </div>
              </div>

              {/* Answer Area */}
              <div className="flex flex-col gap-4 max-w-3xl self-end w-full">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={evaluation || loading}
                  placeholder="Type your answer here..."
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl rounded-tr-sm p-4 text-white focus:border-indigo-500 outline-none min-h-[120px] resize-none"
                />
                {!evaluation && (
                  <button
                    onClick={submitAnswer}
                    disabled={loading || !answer.trim()}
                    className="self-end bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-2 rounded-lg text-sm font-medium transition"
                  >
                    {loading ? "Evaluating..." : "Submit Answer"}
                  </button>
                )}
              </div>

              {/* Evaluation Area */}
              {evaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-900/10 border border-emerald-900/50 rounded-2xl p-6 mt-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <IconCheck className="w-32 h-32 text-emerald-500" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4 border-b border-emerald-900/30 pb-4">
                      <div className="text-3xl font-bold text-emerald-400">{evaluation.score}<span className="text-lg text-emerald-700">/10</span></div>
                      <h4 className="font-semibold text-emerald-500">AI Evaluation</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 block">Strengths:</span>
                        <span className="text-neutral-300">{evaluation.strengths}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Improvement:</span>
                        <span className="text-neutral-300">{evaluation.areasForImprovement}</span>
                      </div>
                      <div className="col-span-2 bg-black/40 p-3 rounded-lg border border-neutral-800/50">
                        <span className="text-indigo-400 font-medium block mb-1">Suggested Better Answer:</span>
                        <span className="text-neutral-300 leading-relaxed">{evaluation.suggestedAnswer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => fetchNextQuestion(sessionId!)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                      Next Question <IconArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {step === "results" && sessionResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Interview Completed</h2>
              <p className="text-neutral-400">Here is your performance summary for {sessionResults.session.targetRole}</p>
            </div>
            
            <div className="flex justify-center mb-12">
              <div className="w-48 h-48 rounded-full border-8 border-indigo-900 flex items-center justify-center relative bg-indigo-900/20">
                <div className="text-center">
                  <span className="text-5xl font-black text-indigo-400">
                    {sessionResults.session.overallScore?.toFixed(1) || 0}
                  </span>
                  <span className="text-xl text-neutral-500 block">/ 10</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-black border border-neutral-800 rounded-xl p-6">
                <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <IconCheck className="w-5 h-5" /> Key Strengths
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm">
                  {sessionResults.session.strengths?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-black border border-neutral-800 rounded-xl p-6">
                <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <IconMicrophone className="w-5 h-5" /> Areas for Improvement
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm">
                  {sessionResults.session.improvementRecommendations?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep("setup")}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-3 rounded-xl font-medium transition"
              >
                Start New Interview
              </button>
            </div>
          </motion.div>
        )}

        {step === "history" && (
           <motion.div
           key="history"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="grid gap-4 md:grid-cols-2"
         >
           {history.length === 0 ? (
             <div className="col-span-2 text-center py-20 text-neutral-500">No mock interviews completed yet.</div>
           ) : (
             history.map((h) => (
               <div key={h._id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="font-semibold text-lg">{h.targetRole}</h3>
                     <p className="text-sm text-neutral-400">{h.interviewType} • {h.difficulty}</p>
                   </div>
                   <div className="bg-indigo-600/20 text-indigo-400 font-bold px-3 py-1 rounded-lg">
                     {h.overallScore ? h.overallScore.toFixed(1) : "N/A"}/10
                   </div>
                 </div>
                 <p className="text-xs text-neutral-500 mb-4">Date: {new Date(h.createdAt).toLocaleDateString()}</p>
                 <button 
                  onClick={() => loadResults(h._id)}
                  className="text-sm bg-neutral-800 hover:bg-neutral-700 transition w-full py-2 rounded-lg"
                 >
                   View Results
                 </button>
               </div>
             ))
           )}
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
