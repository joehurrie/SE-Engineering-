"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  Loader2,
  Phone,
  Calendar,
  Eye,
  X,
} from "lucide-react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/inquiries")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.inquiries) setInquiries(data.inquiries);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleToggleRead = async (inq: Inquiry) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !inq.read }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inq.id ? { ...i, read: !inq.read } : i))
        );
        if (selectedInquiry?.id === inq.id) {
          setSelectedInquiry({ ...selectedInquiry, read: !inq.read });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this inquiry record permanently?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = inquiries.filter((inq) => {
    if (filter === "UNREAD") return !inq.read;
    if (filter === "READ") return inq.read;
    return true;
  });

  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-2">
            CRM & Communications
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            Client Inquiries & Quotes Inbox
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-normal">
            Review commercial tenders and quotes submitted via the website contact form
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-xl border border-[#E2E8F0] self-start sm:self-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === "ALL"
                ? "bg-white text-blue-600 font-semibold shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filter === "UNREAD"
                ? "bg-white text-blue-600 font-semibold shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("READ")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === "READ"
                ? "bg-white text-blue-600 font-semibold shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Processed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-[#64748B] text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading client inquiries from Neon DB...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-none bg-white border border-[#E2E8F0] text-[#64748B] text-sm">
          No inquiries matching this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 rounded-none border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !inq.read
                  ? "bg-white border-blue-300 shadow-sm ring-1 ring-blue-50"
                  : "bg-white/80 border-[#E2E8F0] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">{inq.name}</span>
                  {!inq.read && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      NEW
                    </span>
                  )}
                  <span className="text-xs text-[#64748B] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#94A3B8]" />
                    {inq.email}
                  </span>
                  {inq.phone && (
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#94A3B8]" />
                      {inq.phone}
                    </span>
                  )}
                </div>

                <div className="font-semibold text-xs text-[#334155]">
                  {inq.subject || "General Inquiry"}
                </div>

                <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed font-normal">
                  {inq.message}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-[#64748B] pt-1 font-mono">
                  <Calendar className="w-3 h-3 text-[#94A3B8]" />
                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setSelectedInquiry(inq)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-medium text-[#334155] flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Details</span>
                </button>

                <button
                  onClick={() => handleToggleRead(inq)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    inq.read
                      ? "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] bg-white"
                      : "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  {inq.read ? "Mark Unread" : "Mark as Done"}
                </button>

                <button
                  onClick={() => handleDelete(inq.id)}
                  className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-none max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Inquiry Details</h2>
                <span className="text-xs text-[#64748B]">
                  Received {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs">
                <div>
                  <span className="text-[#64748B] block font-medium">Sender Name</span>
                  <span className="font-bold text-[#0F172A] mt-0.5 block">
                    {selectedInquiry.name}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Phone Number</span>
                  <span className="font-bold text-[#0F172A] mt-0.5 block">
                    {selectedInquiry.phone || "Not provided"}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] block font-medium">Email Address</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-semibold text-blue-600 hover:underline mt-0.5 block"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider block mb-1">
                  Subject / Service Requested:
                </span>
                <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs font-medium text-[#0F172A]">
                  {selectedInquiry.subject || "General Inquiry"}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider block mb-1">
                  Full Tender / Message Content:
                </span>
                <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs leading-relaxed text-[#334155] whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={() => handleToggleRead(selectedInquiry)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {selectedInquiry.read ? "Mark as Unread" : "Mark as Processed"}
              </button>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
