import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { IconTrash, IconPencil, IconRestore, IconScale } from "@tabler/icons-react";
import { motion } from "motion/react";

interface ResumeVersion {
  _id: string;
  versionName: string;
  resumeContent: string;
  atsScore?: number;
  targetRole?: string;
  jobDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ResumeHistoryPage() {
  const { getToken } = useAuth();
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);

  // For renaming
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // For comparing
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume-versions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setVersions(data.responseObject);
        }
      } else {
        toast.error("Failed to load resume versions");
      }
    } catch (err) {
      toast.error("An error occurred while loading versions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this version?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume-versions/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Version deleted");
        fetchVersions();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume-versions/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ versionName: editName }),
      });
      if (res.ok) {
        toast.success("Renamed successfully");
        setEditingId(null);
        fetchVersions();
      } else {
        toast.error("Failed to rename");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm("This will load the version into the editor. Proceed?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume-versions/${id}/restore`, { 
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Restored! Head to the editor to view.");
        // We could redirect to /editor with the restored content or save it to local storage.
      } else {
        toast.error("Failed to restore");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare((prev) => prev.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare((prev) => [...prev, id]);
      } else {
        toast.warning("You can only compare 2 versions at a time.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-white">
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Resume History
          </h1>
          <p className="text-neutral-400 mt-2">Manage and restore your previously saved resume versions.</p>
        </div>
        <button
          onClick={() => {
            setCompareMode(!compareMode);
            setSelectedForCompare([]);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            compareMode ? "bg-indigo-600 text-white" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          {compareMode ? "Cancel Compare" : "Compare Versions"}
        </button>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <IconRestore className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-neutral-300">No versions saved yet</h3>
          <p className="text-neutral-500 mt-2">Generate or edit a resume to start building your history.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {versions.map((version) => (
            <motion.div
              key={version._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border transition-all ${
                compareMode && selectedForCompare.includes(version._id)
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                {editingId === version._id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <button
                      onClick={() => handleRename(version._id)}
                      className="text-xs bg-indigo-600 px-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs bg-neutral-700 px-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg text-neutral-200 truncate pr-2">
                      {version.versionName}
                    </h3>
                    {!compareMode && (
                      <button
                        onClick={() => {
                          setEditingId(version._id);
                          setEditName(version.versionName);
                        }}
                        className="text-neutral-500 hover:text-indigo-400 transition"
                      >
                        <IconPencil className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="text-sm text-neutral-400 space-y-2 mb-6">
                <p>Role: <span className="text-neutral-300">{version.targetRole || "N/A"}</span></p>
                <p>ATS Score: <span className="text-emerald-400 font-medium">{version.atsScore || "N/A"}%</span></p>
                <p>Saved: {new Date(version.createdAt).toLocaleDateString()}</p>
              </div>

              {compareMode ? (
                <button
                  onClick={() => toggleCompare(version._id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                    selectedForCompare.includes(version._id)
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  }`}
                >
                  {selectedForCompare.includes(version._id) ? "Selected" : "Select for Compare"}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(version._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 py-2 rounded-lg text-sm font-medium transition"
                  >
                    <IconRestore className="w-4 h-4" /> Restore
                  </button>
                  <button
                    onClick={() => handleDelete(version._id)}
                    className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 rounded-lg transition"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {compareMode && selectedForCompare.length === 2 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-700 p-4 rounded-2xl shadow-2xl flex items-center gap-6"
          >
            <div>
              <p className="text-sm text-neutral-400">Comparing 2 versions</p>
              <p className="font-medium">Ready to compare</p>
            </div>
            <button
              onClick={() => toast.info("Compare view coming soon!")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-medium transition"
            >
              <IconScale className="w-5 h-5" />
              Compare Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
