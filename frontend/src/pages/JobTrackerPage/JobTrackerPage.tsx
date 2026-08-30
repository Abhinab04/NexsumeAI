import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { IconPlus, IconTrash, IconPencil } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

interface JobApplication {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  applicationDate: string;
  jobLocation?: string;
}

const STATUSES = [
  "Wishlist",
  "Applied",
  "Screening",
  "Interview",
  "Technical Round",
  "HR Round",
  "Offer",
  "Rejected"
];

export default function JobTrackerPage() {
  const { getToken } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Form State
  const [formState, setFormState] = useState<Partial<JobApplication>>({
    companyName: "",
    jobTitle: "",
    status: "Wishlist",
    jobLocation: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = await getToken();
      console.log(token)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/job-tracker`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setApplications(data.responseObject);
        }
      }
    } catch (err) {
      toast.error("Failed to load applications");
    }
  };

  const handleSave = async () => {
    if (!formState.companyName || !formState.jobTitle) {
      toast.error("Company Name and Job Title are required.");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${import.meta.env.VITE_BACKEND_URL}/api/job-tracker/${editingId}` : `${import.meta.env.VITE_BACKEND_URL}/api/job-tracker`;
      
      const token = await getToken();
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        toast.success(editingId ? "Application updated" : "Application added");
        setIsModalOpen(false);
        setEditingId(null);
        setFormState({ companyName: "", jobTitle: "", status: "Wishlist", jobLocation: "" });
        fetchApplications();
      } else {
        toast.error("Failed to save application");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/job-tracker/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Application deleted");
        fetchApplications();
      }
    } catch (err) {
      toast.error("Failed to delete application");
    }
  };

  const openEditModal = (app: JobApplication) => {
    setEditingId(app._id);
    setFormState({
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      status: app.status,
      jobLocation: app.jobLocation,
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/job-tracker/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Moved to ${newStatus}`);
        fetchApplications();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Stats
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "Applied").length;
  const interviews = applications.filter((a) => a.status.includes("Interview") || a.status.includes("Round")).length;
  const offers = applications.filter((a) => a.status === "Offer").length;

  return (
    <div className="p-8 max-w-7xl mx-auto text-white h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Job Tracker
          </h1>
          <p className="text-neutral-400 mt-2">Manage your job search pipeline.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded text-sm transition ${viewMode === "kanban" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-sm transition ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white"}`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormState({ companyName: "", jobTitle: "", status: "Wishlist", jobLocation: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            <IconPlus className="w-5 h-5" /> Add Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 shrink-0">
        {[
          { label: "Total Applications", value: total, color: "text-blue-400" },
          { label: "Applied", value: applied, color: "text-yellow-400" },
          { label: "Interviews", value: interviews, color: "text-purple-400" },
          { label: "Offers", value: offers, color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
            <p className="text-sm text-neutral-400 font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-6 pb-4 kanban-scroll">
          {STATUSES.map((status) => {
            const columnApps = applications.filter((a) => a.status === status);
            return (
              <div key={status} className="w-80 shrink-0 flex flex-col bg-neutral-900/30 rounded-xl border border-neutral-800 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-neutral-300">{status}</h3>
                  <span className="bg-neutral-800 text-xs px-2 py-1 rounded-full text-neutral-400">{columnApps.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {columnApps.map((app) => (
                    <motion.div
                      layout
                      key={app._id}
                      className="bg-black p-4 rounded-lg border border-neutral-700 hover:border-indigo-500/50 transition cursor-pointer group"
                      onClick={() => openEditModal(app)}
                    >
                      <h4 className="font-semibold text-sm truncate">{app.jobTitle}</h4>
                      <p className="text-xs text-indigo-400 mt-1">{app.companyName}</p>
                      
                      <div className="mt-4 flex justify-between items-center text-neutral-500">
                        <select
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          value={app.status}
                          className="text-xs bg-neutral-900 border border-neutral-800 rounded px-1 py-0.5 outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(app._id); }}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-900/30 rounded-xl border border-neutral-800">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 sticky top-0">
              <tr>
                <th className="p-4 text-sm font-medium text-neutral-400">Company</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Role</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Status</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Date</th>
                <th className="p-4 text-sm font-medium text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-neutral-800/30 transition">
                  <td className="p-4 font-medium">{app.companyName}</td>
                  <td className="p-4 text-neutral-300">{app.jobTitle}</td>
                  <td className="p-4">
                    <span className="bg-neutral-800 text-xs px-2 py-1 rounded text-neutral-300">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-neutral-400">{new Date(app.applicationDate).toLocaleDateString()}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => openEditModal(app)} className="p-1 hover:text-indigo-400 text-neutral-500 transition">
                      <IconPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(app._id)} className="p-1 hover:text-red-400 text-neutral-500 transition">
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Application" : "Add Job Application"}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formState.jobTitle}
                    onChange={(e) => setFormState({ ...formState, jobTitle: e.target.value })}
                    className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    value={formState.jobLocation}
                    onChange={(e) => setFormState({ ...formState, jobLocation: e.target.value })}
                    className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
