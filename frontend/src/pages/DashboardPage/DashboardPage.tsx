import { useEffect, useState } from "react";
import { FileUpload } from "../../components/Upload/ui/Upload";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [match, setMatch] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Preview state
  const [previewMode, setPreviewMode] = useState<
    "original" | "optimized"
  >("original");

  // Original PDF preview URL
  const [resumePreviewUrl, setResumePreviewUrl] =
    useState<string | null>(null);

  // Create PDF preview URL whenever user uploads a resume
  useEffect(() => {
    if (!resumeFile) {
      setResumePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(resumeFile);

    setResumePreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [resumeFile]);

  // =====================================================
  // ANALYZE RESUME
  // =====================================================

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume first");
      return;
    }

    if (!jdFile) {
      toast.error("Please upload a job description");
      return;
    }

    setIsLoading(true);

    toast.loading("Analyzing resume...", {
      id: "analyze",
    });

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("job_Description", jdFile);
      formData.append("template", "default");

      console.log(
        "========== ANALYZE REQUEST ==========",
      );

      console.log("Resume:", resumeFile.name);
      console.log("Resume type:", resumeFile.type);
      console.log("Resume size:", resumeFile.size);

      console.log("JD:", jdFile.name);
      console.log("JD type:", jdFile.type);
      console.log("JD size:", jdFile.size);

      console.log(
        "Backend URL:",
        import.meta.env.VITE_BACKEND_URL,
      );

      // =====================================================
      // CLERK AUTHENTICATION
      // =====================================================

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available. Please sign in again.",
        );
      }

      console.log(
        "Clerk token obtained successfully",
      );

      console.log(
        "=====================================",
      );

      // =====================================================
      // SEND REQUEST TO BACKEND
      // =====================================================

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/resume_Score/resume_score`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      console.log(
        "========== ANALYZE RESPONSE ==========",
      );

      console.log("Status:", response.status);
      console.log("Data:", response.data);

      console.log(
        "======================================",
      );

      // =====================================================
      // PROCESS RESPONSE
      // =====================================================

      const resultData = response.data.data;

      if (!resultData) {
        throw new Error(
          "Backend returned a successful response but no analysis data",
        );
      }

      setAnalysisResult(resultData);

      setMatch(resultData?.atsScore || 0);

      // Automatically show optimized resume
      setPreviewMode("optimized");

      toast.success("Analysis complete!", {
        id: "analyze",
      });
    } catch (error) {
      console.error(
        "\n========== ANALYZE ERROR ==========",
      );

      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error);

        console.error(
          "Status:",
          error.response?.status,
        );

        console.error(
          "Status Text:",
          error.response?.statusText,
        );

        console.error(
          "Backend Response:",
          error.response?.data,
        );

        console.error(
          "Backend Message:",
          error.response?.data?.message,
        );

        console.error(
          "Request URL:",
          error.config?.url,
        );

        console.error(
          "Request Method:",
          error.config?.method,
        );
      } else if (error instanceof Error) {
        console.error("Error:", error);

        console.error(
          "Message:",
          error.message,
        );

        console.error(
          "Stack:",
          error.stack,
        );
      } else {
        console.error(
          "Unknown error:",
          error,
        );
      }

      console.error(
        "===================================\n",
      );

      toast.error(
        "Failed to analyze resume",
        {
          id: "analyze",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 text-white bg-gradient-to-br from-gray-900 via-black to-gray-900">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2 text-lg">
          Your AI-powered resume optimizer 🚀
        </p>
      </header>

      {/* ================================================= */}
      {/* UPLOAD SECTION */}
      {/* ================================================= */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        {/* Resume */}

        <UploadCard title="Upload Resume">
          <div className="w-full max-w-xl mx-auto min-h-80 border border-dashed bg-white dark:border-neutral-700 dark:bg-neutral-900 border-neutral-200 rounded-lg">
            <FileUpload
              onChange={(files) => {
                setResumeFile(files[0] || null);

                // Reset analysis when new resume is uploaded
                setAnalysisResult(null);

                setMatch(0);

                setPreviewMode("original");
              }}
            />
          </div>
        </UploadCard>

        {/* Job Description */}

        <UploadCard title="Job Description">
          <div className="w-full max-w-xl mx-auto min-h-80 border border-dashed bg-white dark:border-neutral-700 dark:bg-neutral-900 border-neutral-200 rounded-lg">
            <FileUpload
              onChange={(files) => {
                setJdFile(files[0] || null);
              }}
            />
          </div>
        </UploadCard>

      </section>

      {/* ================================================= */}
      {/* ATS RESULT */}
      {/* ================================================= */}

      {analysisResult ? (

        <section className="backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 mb-12 shadow-2xl hover:border-indigo-500/30 transition-all duration-300">

          <div className="flex flex-col md:flex-row gap-10">

            {/* ATS SCORE */}

            <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-4 border-r border-gray-700/50 pr-0 md:pr-8">

              <h2 className="text-2xl font-bold text-gray-200">
                ATS Score
              </h2>

              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-800 bg-gray-900 shadow-inner">

                <div
                  className="absolute inset-0 rounded-full border-8 border-indigo-500"
                  style={{
                    clipPath: `polygon(
                      0 0,
                      100% 0,
                      100% ${match}%,
                      0 ${match}%
                    )`,
                    transform: `rotate(${(match / 100) * 360}deg)`,
                  }}
                />

                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                  {match}
                </div>

                <div className="absolute bottom-4 text-xs font-semibold text-gray-400">
                  OUT OF 100
                </div>

              </div>

              <p className="text-center text-gray-300 text-sm italic">
                {analysisResult.scoreJustification}
              </p>

            </div>

            {/* KEYWORDS */}

            <div className="w-full md:w-2/3 space-y-8">

              {/* Matched */}

              <div>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400 flex items-center gap-2">
                  <span>✅</span>
                  Matched Keywords
                </h3>

                <div className="flex flex-wrap gap-2">

                  {analysisResult.matchedKeywords?.map(
                    (
                      kw: string,
                      i: number,
                    ) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm font-medium"
                      >
                        {kw}
                      </span>
                    ),
                  )}

                </div>
              </div>

              {/* Missing */}

              <div>
                <h3 className="text-xl font-semibold mb-3 text-rose-400 flex items-center gap-2">
                  <span>❌</span>
                  Missing Keywords
                </h3>

                <div className="flex flex-wrap gap-2">

                  {analysisResult.missingKeywords?.map(
                    (
                      kw: string,
                      i: number,
                    ) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-sm font-medium"
                      >
                        {kw}
                      </span>
                    ),
                  )}

                </div>
              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* RECOMMENDATIONS */}
          {/* ================================================= */}

          <div className="mt-10 border-t border-gray-700/50 pt-8 space-y-8">

            {/* Improvements */}

            <div>
              <h3 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
                <span>💡</span>
                AI Recommendations & Improvements
              </h3>

              <ul className="space-y-2 text-gray-300 list-disc list-inside">

                {analysisResult.keyImprovements?.map(
                  (
                    imp: string,
                    i: number,
                  ) => (
                    <li key={i}>
                      {imp}
                    </li>
                  ),
                )}

              </ul>
            </div>

            {/* Roadmap */}

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center gap-2">
                <span>📚</span>
                Learning Roadmap
              </h3>

              <ul className="space-y-2 text-gray-300 list-disc list-inside">

                {analysisResult.learningRoadmap?.map(
                  (
                    road: string,
                    i: number,
                  ) => (
                    <li key={i}>
                      {road}
                    </li>
                  ),
                )}

              </ul>
            </div>

          </div>

          {/* Tailor */}

          <div className="mt-8 flex justify-end">

            <ActionButton
              primary
              text="Tailor Resume"
              onClick={() =>
                navigate(
                  "/editor",
                  {
                    state: {
                      result:
                        analysisResult,
                    },
                  },
                )
              }
            />

          </div>

        </section>

      ) : (

        <section className="backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 mb-12 shadow-2xl hover:border-indigo-500/30 transition-all duration-300">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

            <div className="w-full md:w-1/2 space-y-4">

              <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
                Ready for Analysis
              </h2>

              <p className="text-gray-400">
                Upload your resume and the job description, then click Analyze to see your ATS match score and AI-powered recommendations.
              </p>

            </div>

            <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4 justify-end">

              <ActionButton
                primary
                text={
                  isLoading
                    ? "Analyzing..."
                    : "Analyze Resume"
                }
                onClick={handleAnalyze}
                disabled={isLoading}
              />

            </div>

          </div>

        </section>

      )}

      {/* ================================================= */}
      {/* RESUME PREVIEW */}
      {/* ================================================= */}

      {resumeFile && (

        <section className="backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 shadow-2xl mb-12">

          {/* Header */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
                Resume Preview
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Compare your original resume with the AI-optimized version.
              </p>
            </div>

            {/* Toggle */}

            <div className="flex gap-3">

              <PreviewButton
                text="Original Resume"
                active={previewMode === "original"}
                onClick={() =>
                  setPreviewMode("original")
                }
              />

              <PreviewButton
                text="Optimized Resume"
                active={previewMode === "optimized"}
                disabled={
                  !analysisResult?.structuredResume
                }
                onClick={() =>
                  setPreviewMode("optimized")
                }
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* ORIGINAL RESUME */}
          {/* ================================================= */}

          {previewMode === "original" && (

            <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-950">

              <div className="px-5 py-3 border-b border-gray-700 bg-gray-900 flex items-center justify-between">

                <div>
                  <p className="text-gray-200 font-medium">
                    Original Resume
                  </p>

                  <p className="text-gray-500 text-xs">
                    {resumeFile.name}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400">
                  ORIGINAL
                </span>

              </div>

              <div className="h-[850px] bg-white">

                {resumePreviewUrl ? (
                  <iframe
                    src={resumePreviewUrl}
                    title="Original Resume Preview"
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Unable to preview resume
                  </div>
                )}

              </div>

            </div>

          )}

          {/* ================================================= */}
          {/* OPTIMIZED RESUME */}
          {/* ================================================= */}

          {previewMode === "optimized" && (

            <div className="rounded-2xl overflow-hidden border border-gray-700 bg-white">

              <div className="px-5 py-3 border-b border-gray-700 bg-gray-900 flex items-center justify-between">

                <div>
                  <p className="text-white font-medium">
                    Optimized Resume
                  </p>

                  <p className="text-gray-400 text-xs">
                    AI-generated resume based on your original resume
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  OPTIMIZED
                </span>

              </div>

              {analysisResult?.structuredResume ? (

                <OptimizedResumePreview
                  resume={analysisResult.structuredResume}
                />

              ) : (

                <div className="h-96 flex items-center justify-center text-gray-500 bg-gray-950">
                  Analyze your resume first to view the optimized version.
                </div>

              )}

            </div>

          )}

        </section>

      )}

    </div>
  );
}

/* ===================================================== */
/* UPLOAD CARD */
/* ===================================================== */

const UploadCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-500 shadow-xl hover:shadow-indigo-500/20">

    <h3 className="text-lg font-semibold mb-4 text-gray-200">
      {title}
    </h3>

    <div className="relative">
      {children}
    </div>

  </div>
);

/* ===================================================== */
/* ACTION BUTTON */
/* ===================================================== */

const ActionButton = ({
  text,
  primary,
  onClick,
  disabled,
}: {
  text: string;
  primary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
      primary
        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-indigo-500/25"
        : "border border-indigo-500/30 hover:bg-indigo-500/10"
    } ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    {text}
  </button>
);

/* ===================================================== */
/* PREVIEW BUTTON */
/* ===================================================== */

const PreviewButton = ({
  text,
  active,
  disabled,
  onClick,
}: {
  text: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    } ${
      disabled
        ? "opacity-40 cursor-not-allowed"
        : ""
    }`}
  >
    {text}
  </button>
);

/* ===================================================== */
/* OPTIMIZED RESUME PREVIEW */
/* ===================================================== */

const OptimizedResumePreview = ({
  resume,
}: {
  resume: any;
}) => {
  const personalInfo =
    resume.personalInfo || {};

  const experience =
    resume.experience || [];

  const education =
    resume.education || [];

  const skills =
    resume.skills || {};

  const projects =
    resume.projects || [];

  return (
    <div className="min-h-[850px] text-black p-8 md:p-12 overflow-auto">

      {/* Personal Info */}

      <div className="text-center border-b border-gray-300 pb-5 mb-6">

        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
          {personalInfo.fullName ||
            "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-sm text-gray-700">

          {personalInfo.email && (
            <span>
              {personalInfo.email}
            </span>
          )}

          {personalInfo.phone && (
            <span>
              {personalInfo.phone}
            </span>
          )}

          {personalInfo.linkedin && (
            <span>
              {personalInfo.linkedin}
            </span>
          )}

          {personalInfo.github && (
            <span>
              {personalInfo.github}
            </span>
          )}

          {personalInfo.portfolio && (
            <span>
              {personalInfo.portfolio}
            </span>
          )}

        </div>

      </div>

      {/* Summary */}

      {resume.summary && (
        <ResumePreviewSection title="SUMMARY">
          <p className="text-sm leading-6 text-gray-800">
            {resume.summary}
          </p>
        </ResumePreviewSection>
      )}

      {/* Experience */}

      {experience.length > 0 && (
        <ResumePreviewSection title="EXPERIENCE">

          {experience.map(
            (
              item: any,
              index: number,
            ) => (

              <div
                key={index}
                className="mb-5"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-1">

                  <div>
                    <h3 className="font-bold text-base">
                      {item.role}
                    </h3>

                    <p className="italic text-gray-700">
                      {item.company}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 md:text-right">

                    <p>
                      {item.startDate} -{" "}
                      {item.endDate}
                    </p>

                    {item.location && (
                      <p>
                        {item.location}
                      </p>
                    )}

                  </div>

                </div>

                <ul className="mt-2 list-disc list-inside space-y-1 text-sm leading-5">

                  {item.description?.map(
                    (
                      bullet: string,
                      bulletIndex: number,
                    ) => (
                      <li
                        key={bulletIndex}
                      >
                        {bullet}
                      </li>
                    ),
                  )}

                </ul>

              </div>

            ),
          )}

        </ResumePreviewSection>
      )}

      {/* Education */}

      {education.length > 0 && (
        <ResumePreviewSection title="EDUCATION">

          {education.map(
            (
              item: any,
              index: number,
            ) => (

              <div
                key={index}
                className="mb-4"
              >

                <div className="flex flex-col md:flex-row md:justify-between">

                  <div>

                    <h3 className="font-bold">
                      {item.institution}
                    </h3>

                    <p className="text-sm">
                      {item.degree}
                    </p>

                  </div>

                  <div className="text-sm text-gray-600 md:text-right">

                    <p>
                      {item.startDate} -{" "}
                      {item.endDate}
                    </p>

                    {item.location && (
                      <p>
                        {item.location}
                      </p>
                    )}

                  </div>

                </div>

                {item.gpa && (
                  <p className="text-sm mt-1">
                    GPA: {item.gpa}
                  </p>
                )}

              </div>

            ),
          )}

        </ResumePreviewSection>
      )}

      {/* Skills */}

      {(
        skills.languages?.length ||
        skills.frameworks?.length ||
        skills.tools?.length
      ) ? (

        <ResumePreviewSection title="SKILLS">

          <div className="text-sm leading-6">

            {skills.languages?.length > 0 && (
              <p>
                <strong>
                  Languages:
                </strong>{" "}
                {skills.languages.join(
                  ", ",
                )}
              </p>
            )}

            {skills.frameworks?.length > 0 && (
              <p>
                <strong>
                  Frameworks:
                </strong>{" "}
                {skills.frameworks.join(
                  ", ",
                )}
              </p>
            )}

            {skills.tools?.length > 0 && (
              <p>
                <strong>
                  Tools:
                </strong>{" "}
                {skills.tools.join(
                  ", ",
                )}
              </p>
            )}

          </div>

        </ResumePreviewSection>

      ) : null}

      {/* Projects */}

      {projects.length > 0 && (
        <ResumePreviewSection title="PROJECTS">

          {projects.map(
            (
              project: any,
              index: number,
            ) => (

              <div
                key={index}
                className="mb-5"
              >

                <div className="flex flex-col md:flex-row md:justify-between">

                  <h3 className="font-bold">
                    {project.name}
                  </h3>

                  {project.link && (
                    <span className="text-sm text-indigo-600">
                      {project.link}
                    </span>
                  )}

                </div>

                {project.technologies?.length > 0 && (
                  <p className="text-sm italic text-gray-600 mt-1">
                    {project.technologies.join(
                      ", ",
                    )}
                  </p>
                )}

                <ul className="mt-2 list-disc list-inside space-y-1 text-sm leading-5">

                  {project.description?.map(
                    (
                      bullet: string,
                      bulletIndex: number,
                    ) => (
                      <li
                        key={bulletIndex}
                      >
                        {bullet}
                      </li>
                    ),
                  )}

                </ul>

              </div>

            ),
          )}

        </ResumePreviewSection>
      )}

    </div>
  );
};

/* ===================================================== */
/* PREVIEW SECTION */
/* ===================================================== */

const ResumePreviewSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-6">

    <h2 className="text-base font-bold border-b-2 border-gray-800 pb-1 mb-3">
      {title}
    </h2>

    {children}

  </section>
);
