import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { IconMap, IconTrophy, IconHistory } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export default function SkillRoadmapPage() {
  const { getToken } = useAuth();
  const [step, setStep] = useState<"setup" | "view" | "history">("setup");
  const [loading, setLoading] = useState(false);

  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [roadmap, setRoadmap] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const generateRoadmap = async () => {
    if (!resumeContent || !jobDescription || !targetRole) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/features/skill-roadmap/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ resumeContent, jobDescription, targetRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRoadmap(data.responseObject);
        setStep("view");
      } else {
        toast.error("Failed to generate roadmap.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/features/skill-roadmap`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory(data.responseObject);
        setStep("history");
      }
    } catch (err) {
      toast.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const updateSkillStatus = async (phaseIndex: number, skillIndex: number, status: string) => {
    if (!roadmap) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/features/skill-roadmap/${roadmap._id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ phaseIndex, skillIndex, status }),
      });
      if (res.ok) {
        // Optimistic update
        const updatedRoadmap = { ...roadmap };
        updatedRoadmap.roadmapPhases[phaseIndex].skills[skillIndex].status = status;
        setRoadmap(updatedRoadmap);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Completed") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (status === "Learning") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-neutral-400 bg-neutral-800 border-neutral-700";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 flex items-center gap-3">
            <IconMap className="w-8 h-8 text-indigo-500" /> Skill Roadmap
          </h1>
          <p className="text-neutral-400 mt-2">Identify your skill gaps and get a personalized learning path.</p>
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
            New Analysis
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
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 max-w-3xl mx-auto"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here"
                  rows={4}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Your Resume Content</label>
                <textarea
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  placeholder="Paste your resume text here"
                  rows={5}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={generateRoadmap}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition disabled:opacity-50"
              >
                {loading ? "Analyzing Gap & Building Roadmap..." : <><IconMap className="w-5 h-5" /> Analyze Skills & Generate Roadmap</>}
              </button>
            </div>
          </motion.div>
        )}

        {step === "view" && roadmap && (
          <motion.div
            key="view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-indigo-400">{roadmap.jobReadinessScore}%</span>
                <span className="text-sm text-neutral-400 mt-2 text-center">Job Readiness Score</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-emerald-400">{roadmap.skillMatchPercentage}%</span>
                <span className="text-sm text-neutral-400 mt-2 text-center">Skill Match</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-red-400">{roadmap.missingSkillsCount}</span>
                <span className="text-sm text-neutral-400 mt-2 text-center">Missing Skills</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                <span className="text-sm text-neutral-400 mb-2 block">Strongest Skills</span>
                <div className="flex flex-wrap gap-2">
                  {roadmap.strongestSkills.map((s: string) => (
                    <span key={s} className="bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
              {roadmap.roadmapPhases.map((phase: any, pIdx: number) => (
                <div key={pIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_0_4px_#000]">
                    {pIdx + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
                    <h3 className="font-bold text-xl text-white mb-4">{phase.phaseName}</h3>
                    <div className="space-y-4">
                      {phase.skills.map((skill: any, sIdx: number) => (
                        <div key={sIdx} className="bg-black border border-neutral-800 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-indigo-400">{skill.skillName}</h4>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded ${skill.priority === 'High' ? 'bg-red-500/20 text-red-400' : skill.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>Priority: {skill.priority}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">{skill.difficulty}</span>
                              </div>
                            </div>
                            <select
                              value={skill.status}
                              onChange={(e) => updateSkillStatus(pIdx, sIdx, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-lg border outline-none cursor-pointer ${getStatusColor(skill.status)}`}
                            >
                              <option className="bg-neutral-900 text-white" value="Not Started">Not Started</option>
                              <option className="bg-neutral-900 text-white" value="Learning">Learning</option>
                              <option className="bg-neutral-900 text-white" value="Completed">Completed</option>
                            </select>
                          </div>
                          <p className="text-sm text-neutral-400 mb-3">{skill.importance}</p>
                          {skill.suggestedProject && (
                            <div className="bg-indigo-600/10 border border-indigo-600/20 p-3 rounded-lg flex gap-3 items-start">
                              <IconTrophy className="w-5 h-5 text-indigo-400 shrink-0" />
                              <div>
                                <span className="block text-xs font-semibold text-indigo-300 mb-1">Suggested Project</span>
                                <span className="text-xs text-indigo-200/70 leading-relaxed">{skill.suggestedProject}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "history" && (
           <motion.div
           key="history"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
         >
           {history.length === 0 ? (
             <div className="col-span-full text-center py-20 text-neutral-500">No roadmaps generated yet.</div>
           ) : (
             history.map((h) => (
               <div key={h._id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition">
                 <h3 className="font-semibold text-lg mb-1">{h.targetRole}</h3>
                 <p className="text-xs text-neutral-500 mb-4">Generated on {new Date(h.createdAt).toLocaleDateString()}</p>
                 
                 <div className="flex gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-indigo-400">{h.jobReadinessScore}%</div>
                      <div className="text-xs text-neutral-500">Readiness</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{h.missingSkillsCount}</div>
                      <div className="text-xs text-neutral-500">Missing Skills</div>
                    </div>
                 </div>

                 <button 
                  onClick={() => {
                    setRoadmap(h);
                    setStep("view");
                  }}
                  className="text-sm bg-neutral-800 hover:bg-neutral-700 text-white transition w-full py-2 rounded-lg"
                 >
                   View Full Roadmap
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
