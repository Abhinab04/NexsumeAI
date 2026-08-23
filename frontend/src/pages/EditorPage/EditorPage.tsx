import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { StructuredResume } from "../../types/resume";

export default function EditorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialResume =
    state?.result?.structuredResume as
      | StructuredResume
      | undefined;

  const [resume, setResume] =
    useState<StructuredResume | undefined>(
      initialResume
    );

  const [templateId, setTemplateId] =
    useState("jakes_resume");

  const [isGenerating, setIsGenerating] =
    useState(false);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold text-gray-200">
          No Resume Data Found
        </h2>

        <p className="text-gray-400">
          Please analyze a resume first.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // Handle editor changes
  // --------------------------------------------------

  const handleChange = (
    section: keyof StructuredResume,
    field: string,
    value: any,
    index?: number
  ) => {
    setResume((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
      };

      if (index !== undefined) {
        // Array fields:
        // experience, education, projects
        (updated[section] as any)[index] = {
          ...(updated[section] as any)[index],
          [field]: value,
        };
      } else if (
        typeof updated[section] === "object" &&
        !Array.isArray(updated[section])
      ) {
        // Nested object:
        // personalInfo, skills
        (updated[section] as any) = {
          ...(updated[section] as any),
          [field]: value,
        };
      } else {
        // String field:
        // summary
        (updated as any)[section] = value;
      }

      return updated;
    });
  };

  // --------------------------------------------------
  // Generate PDF
  // --------------------------------------------------

  const handleGeneratePdf = async () => {
    if (!resume) {
      alert("Resume data is missing.");
      return;
    }

    try {
      setIsGenerating(true);

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        throw new Error(
          "VITE_BACKEND_URL is not configured."
        );
      }

      const endpoint =
        `${backendUrl}/api/features/resume/generate-pdf`;

      console.log(
        "========== PDF REQUEST =========="
      );

      console.log(
        "Backend URL:",
        backendUrl
      );

      console.log(
        "PDF endpoint:",
        endpoint
      );

      console.log(
        "Template:",
        templateId
      );

      console.log(
        "Resume data:",
        resume
      );

      console.log(
        "================================="
      );

      // ---------------------------------------------
      // Send resume to backend
      // ---------------------------------------------

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf, application/json",
        },

        body: JSON.stringify({
          structuredResume: resume,
          templateId: templateId,
        }),
      });

      console.log(
        "PDF response status:",
        response.status
      );

      console.log(
        "PDF response content-type:",
        response.headers.get(
          "content-type"
        )
      );

      // ---------------------------------------------
      // Handle backend error
      // ---------------------------------------------

      if (!response.ok) {
        const contentType =
          response.headers.get(
            "content-type"
          );

        let errorMessage =
          `PDF generation failed (${response.status})`;

        if (
          contentType?.includes(
            "application/json"
          )
        ) {
          try {
            const errorData =
              await response.json();

            console.error(
              "Backend PDF error:",
              errorData
            );

            errorMessage =
              errorData.message ||
              errorData.error ||
              errorMessage;
          } catch (jsonError) {
            console.error(
              "Could not parse backend error:",
              jsonError
            );
          }
        } else {
          try {
            const text =
              await response.text();

            console.error(
              "Backend response:",
              text
            );

            if (text) {
              errorMessage = text;
            }
          } catch (textError) {
            console.error(
              "Could not read backend response:",
              textError
            );
          }
        }

        throw new Error(errorMessage);
      }

      // ---------------------------------------------
      // Make sure response is actually a PDF
      // ---------------------------------------------

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/pdf"
        )
      ) {
        console.warn(
          "Expected PDF but received:",
          contentType
        );
      }

      // ---------------------------------------------
      // Convert response to Blob
      // ---------------------------------------------

      const blob =
        await response.blob();

      console.log(
        "PDF blob size:",
        blob.size
      );

      console.log(
        "PDF blob type:",
        blob.type
      );

      if (blob.size === 0) {
        throw new Error(
          "Generated PDF is empty."
        );
      }

      // ---------------------------------------------
      // Download PDF
      // ---------------------------------------------

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "Optimized_Resume.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Release object URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      console.log(
        "PDF downloaded successfully."
      );

    } catch (error) {
      console.error(
        "========== PDF ERROR =========="
      );

      console.error(error);

      if (error instanceof Error) {
        console.error(
          "Message:",
          error.message
        );

        alert(
          `Failed to generate PDF:\n\n${error.message}`
        );
      } else {
        alert(
          "An unknown error occurred while generating the PDF."
        );
      }

      console.error(
        "================================"
      );

    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-neutral-800">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">

        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Resume Editor
        </h1>

        <div className="flex items-center gap-4">

          <select
            value={templateId}
            onChange={(e) =>
              setTemplateId(e.target.value)
            }
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
          >
            <option value="jakes_resume">
              Professional (Jake's Resume)
            </option>

            <option value="template2">
              Two-Column (Template 2)
            </option>

            <option value="template3">
              Classic (Template 3)
            </option>

            <option value="template4">
              Modern (Jitin Nair)
            </option>

            <option value="anubhav">
              Modern Academic (Anubhav Singh)
            </option>

            <option value="minimal">
              Minimal
            </option>
          </select>

          <button
            className={`px-6 py-2 rounded-lg font-medium shadow-md transition text-white ${
              isGenerating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onClick={handleGeneratePdf}
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating..."
              : "Save & Generate PDF"}
          </button>

        </div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

        {/* Left Pane */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-6 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">

          <div className="space-y-8 max-w-2xl mx-auto">

            {/* Personal Information */}
            <section>

              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  value={
                    resume.personalInfo.fullName
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "fullName",
                      e.target.value
                    )
                  }
                  placeholder="Full Name"
                  className="p-2 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-full"
                />

                <input
                  type="email"
                  value={
                    resume.personalInfo.email
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Email"
                  className="p-2 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-full"
                />

                <input
                  type="text"
                  value={
                    resume.personalInfo.phone
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="Phone"
                  className="p-2 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-full"
                />

                <input
                  type="text"
                  value={
                    resume.personalInfo.linkedin ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "linkedin",
                      e.target.value
                    )
                  }
                  placeholder="LinkedIn URL"
                  className="p-2 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-full"
                />

              </div>
            </section>

            {/* Summary */}
            <section>

              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                Professional Summary
              </h2>

              <textarea
                value={resume.summary}
                onChange={(e) =>
                  setResume((prev) =>
                    prev
                      ? {
                          ...prev,
                          summary:
                            e.target.value,
                        }
                      : prev
                  )
                }
                className="p-2 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-full h-32"
              />

            </section>

            {/* Experience */}
            <section>

              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                Experience
              </h2>

              {resume.experience.map(
                (exp, idx) => (
                  <div
                    key={idx}
                    className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-neutral-800/50 space-y-3"
                  >

                    <div className="grid grid-cols-2 gap-3">

                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          handleChange(
                            "experience",
                            "company",
                            e.target.value,
                            idx
                          )
                        }
                        placeholder="Company"
                        className="p-2 rounded bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-full"
                      />

                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          handleChange(
                            "experience",
                            "role",
                            e.target.value,
                            idx
                          )
                        }
                        placeholder="Role"
                        className="p-2 rounded bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-full"
                      />

                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleChange(
                            "experience",
                            "startDate",
                            e.target.value,
                            idx
                          )
                        }
                        placeholder="Start Date"
                        className="p-2 rounded bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-full"
                      />

                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) =>
                          handleChange(
                            "experience",
                            "endDate",
                            e.target.value,
                            idx
                          )
                        }
                        placeholder="End Date"
                        className="p-2 rounded bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-full"
                      />

                    </div>

                    <textarea
                      value={exp.description.join(
                        "\n"
                      )}
                      onChange={(e) =>
                        handleChange(
                          "experience",
                          "description",
                          e.target.value.split(
                            "\n"
                          ),
                          idx
                        )
                      }
                      placeholder="Description (one bullet per line)"
                      className="p-2 rounded bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-full h-32"
                    />

                  </div>
                )
              )}

            </section>

          </div>
        </div>

        {/* Right Pane */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-gray-200 dark:bg-neutral-800 p-8 flex justify-center">

          <div
            className={`bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-10 text-gray-900 ${
              templateId ===
                "template4" ||
              templateId === "anubhav"
                ? "font-sans"
                : "font-serif"
            }`}
          >

            {/* Two column template */}
            {templateId === "template2" ? (

              <div className="flex gap-6 h-full">

                <div className="w-1/3 border-r border-gray-300 pr-6">

                  <h1 className="text-3xl font-bold uppercase text-indigo-900 mb-2">
                    {resume.personalInfo.fullName}
                  </h1>

                  <div className="text-sm flex flex-col gap-1 mb-6 text-gray-600">
                    <span>
                      {resume.personalInfo.email}
                    </span>

                    <span>
                      {resume.personalInfo.phone}
                    </span>

                    {resume.personalInfo.linkedin && (
                      <span>
                        {resume.personalInfo.linkedin}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold uppercase border-b-2 border-indigo-900 mb-2 text-indigo-900">
                    Education
                  </h2>

                  {resume.education.map(
                    (edu, idx) => (
                      <div
                        key={idx}
                        className="mb-4"
                      >
                        <div className="font-semibold text-gray-800">
                          {edu.institution}
                        </div>

                        <div className="text-xs text-gray-500 mb-1">
                          {edu.startDate} -{" "}
                          {edu.endDate}
                        </div>

                        <div className="text-sm text-gray-700">
                          {edu.degree}{" "}
                          {edu.gpa &&
                            `| GPA: ${edu.gpa}`}
                        </div>
                      </div>
                    )
                  )}

                  <h2 className="text-lg font-bold uppercase border-b-2 border-indigo-900 mb-2 text-indigo-900 mt-6">
                    Skills
                  </h2>

                  <div className="text-sm space-y-2 text-gray-700">

                    {resume.skills.languages
                      ?.length > 0 && (
                      <div>
                        <strong className="block text-gray-900">
                          Languages:
                        </strong>

                        {resume.skills.languages.join(
                          ", "
                        )}
                      </div>
                    )}

                    {resume.skills.frameworks
                      ?.length > 0 && (
                      <div>
                        <strong className="block text-gray-900">
                          Frameworks:
                        </strong>

                        {resume.skills.frameworks.join(
                          ", "
                        )}
                      </div>
                    )}

                    {resume.skills.tools
                      ?.length > 0 && (
                      <div>
                        <strong className="block text-gray-900">
                          Tools:
                        </strong>

                        {resume.skills.tools.join(
                          ", "
                        )}
                      </div>
                    )}

                  </div>

                </div>

                <div className="w-2/3">

                  <div className="mb-6">
                    <p className="text-sm leading-relaxed text-gray-700">
                      {resume.summary}
                    </p>
                  </div>

                  <h2 className="text-lg font-bold uppercase border-b-2 border-indigo-900 mb-3 text-indigo-900">
                    Experience
                  </h2>

                  {resume.experience.map(
                    (exp, idx) => (
                      <div
                        key={idx}
                        className="mb-5"
                      >

                        <div className="flex justify-between font-bold text-gray-800">
                          <span>
                            {exp.role}
                          </span>

                          <span className="text-sm font-normal text-gray-600">
                            {exp.startDate} -{" "}
                            {exp.endDate}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm text-indigo-700 font-semibold mb-2">
                          <span>
                            {exp.company}
                          </span>

                          <span>
                            {exp.location}
                          </span>
                        </div>

                        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                          {exp.description.map(
                            (
                              bullet,
                              i
                            ) => (
                              <li key={i}>
                                {bullet}
                              </li>
                            )
                          )}
                        </ul>

                      </div>
                    )
                  )}

                </div>

              </div>

            ) : (

              /* Default templates */

              <div>

                {/* Header */}
                <div
                  className={`${
                    templateId ===
                      "template4" ||
                    templateId ===
                      "anubhav"
                      ? "text-left border-b-4 border-indigo-600"
                      : "text-center border-b-2 border-gray-800"
                  } pb-4 mb-4`}
                >

                  <h1 className="text-3xl font-bold uppercase">
                    {resume.personalInfo.fullName}
                  </h1>

                  <div
                    className={`text-sm mt-2 flex ${
                      templateId ===
                        "template4" ||
                      templateId ===
                        "anubhav"
                        ? "justify-start"
                        : "justify-center"
                    } gap-4 flex-wrap`}
                  >

                    <span>
                      {resume.personalInfo.email}
                    </span>

                    <span>
                      {resume.personalInfo.phone}
                    </span>

                    {resume.personalInfo.linkedin && (
                      <span>
                        {resume.personalInfo.linkedin}
                      </span>
                    )}

                  </div>

                </div>

                {/* Summary */}
                <div className="mb-4">

                  <p className="text-sm leading-relaxed">
                    {resume.summary}
                  </p>

                </div>

                {/* Experience */}
                <div className="mb-4">

                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">
                    Experience
                  </h2>

                  {resume.experience.map(
                    (exp, idx) => (
                      <div
                        key={idx}
                        className="mb-3"
                      >

                        <div className="flex justify-between font-semibold">

                          <span>
                            {exp.role}
                          </span>

                          <span>
                            {exp.startDate} -{" "}
                            {exp.endDate}
                          </span>

                        </div>

                        <div className="flex justify-between text-sm italic mb-1">

                          <span>
                            {exp.company}
                          </span>

                          <span>
                            {exp.location}
                          </span>

                        </div>

                        <ul className="list-disc pl-5 text-sm space-y-1">

                          {exp.description.map(
                            (
                              bullet,
                              i
                            ) => (
                              <li key={i}>
                                {bullet}
                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )
                  )}

                </div>

                {/* Education */}
                <div className="mb-4">

                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">
                    Education
                  </h2>

                  {resume.education.map(
                    (edu, idx) => (
                      <div
                        key={idx}
                        className="mb-2"
                      >

                        <div className="flex justify-between font-semibold">

                          <span>
                            {edu.institution}
                          </span>

                          <span>
                            {edu.startDate} -{" "}
                            {edu.endDate}
                          </span>

                        </div>

                        <div className="text-sm italic">
                          {edu.degree}{" "}
                          {edu.gpa &&
                            `| GPA: ${edu.gpa}`}
                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* Skills */}
                <div className="mb-4">

                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">
                    Skills
                  </h2>

                  <div className="text-sm space-y-1">

                    {resume.skills.languages
                      ?.length > 0 && (
                      <div>
                        <strong>
                          Languages:
                        </strong>{" "}
                        {resume.skills.languages.join(
                          ", "
                        )}
                      </div>
                    )}

                    {resume.skills.frameworks
                      ?.length > 0 && (
                      <div>
                        <strong>
                          Frameworks:
                        </strong>{" "}
                        {resume.skills.frameworks.join(
                          ", "
                        )}
                      </div>
                    )}

                    {resume.skills.tools
                      ?.length > 0 && (
                      <div>
                        <strong>
                          Tools:
                        </strong>{" "}
                        {resume.skills.tools.join(
                          ", "
                        )}
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}