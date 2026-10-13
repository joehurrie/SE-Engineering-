"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  FolderGit2,
  Wrench,
  Mail,
  ArrowRight,
  PlusCircle,
  Database,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";

type StatsData = {
  productsCount: number;
  servicesCount: number;
  projectsCount: number;
  inquiriesCount: number;
  unreadInquiriesCount: number;
  recentInquiries: Array<{
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-2">
            Specialized Engineering CMS
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-normal">
            Real-time management for elevators, services, projects, and incoming client requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-medium transition shadow-sm"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
          </Link>
          <Link
            href="/admin/elevators"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-[#0284C7] text-white text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Database Connection Banner */}
      <div className="p-4 rounded-none bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#0F172A]">Neon PostgreSQL Database</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live & Synced
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Host: <span className="font-mono text-[#0F172A]">ep-rough-smoke-b5ac53zw-pooler</span> • Schema: public
            </p>
          </div>
        </div>
        <div className="text-xs text-[#475569] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">8 Elevator Categories Active</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-[#64748B] text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading dashboard metrics...</span>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-none bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Elevator Products
                </span>
                <div className="text-3xl font-extrabold text-[#0F172A] mt-1.5">{stats?.productsCount ?? 0}</div>
                <p className="text-[11px] text-[#64748B] mt-1">Across 8 SRS categories</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-none bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Lift Services
                </span>
                <div className="text-3xl font-extrabold text-[#0F172A] mt-1.5">{stats?.servicesCount ?? 0}</div>
                <p className="text-[11px] text-[#64748B] mt-1">Spare Parts, Modernization & Custom</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <Wrench className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-none bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Portfolio Projects
                </span>
                <div className="text-3xl font-extrabold text-[#0F172A] mt-1.5">{stats?.projectsCount ?? 0}</div>
                <p className="text-[11px] text-[#64748B] mt-1">Nairobi high-rises & villas</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <FolderGit2 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-none bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Inquiries Inbox
                </span>
                <div className="text-3xl font-extrabold text-[#0F172A] mt-1.5 flex items-baseline gap-2">
                  {stats?.inquiriesCount ?? 0}
                  {(stats?.unreadInquiriesCount ?? 0) > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      {stats?.unreadInquiriesCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">Tenders & customer quotes</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/elevators"
              className="group p-6 rounded-none bg-white border border-[#E2E8F0] hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#0F172A] group-hover:text-blue-600 transition">
                  Elevator Catalog CRUD
                </h3>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                  Add new elevator models, update technical specifications, upload photos and set featured units.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                <span>Open catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            <Link
              href="/admin/content"
              className="group p-6 rounded-none bg-white border border-[#E2E8F0] hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#0F172A] group-hover:text-blue-600 transition">
                  Static Copy & Text CMS
                </h3>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                  Edit the home hero slogan, Kilimani company metrics, contacts, and about us copy without touching code.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                <span>Edit copy</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            <Link
              href="/admin/inquiries"
              className="group p-6 rounded-none bg-white border border-[#E2E8F0] hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#0F172A] group-hover:text-blue-600 transition">
                  Customer Inquiries
                </h3>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                  Review tenders submitted by developers, architects, and facility managers across East Africa.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                <span>View messages</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>

          {/* Recent Inquiries List */}
          <div className="p-6 rounded-none bg-white border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Recent Inquiries & Quotes</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Incoming inquiries submitted through public contact form</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {(!stats?.recentInquiries || stats.recentInquiries.length === 0) ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
                No inquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {stats.recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#0F172A]">{inq.name}</span>
                        <span className="text-xs text-[#64748B]">({inq.email})</span>
                        {!inq.read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#475569] truncate mt-0.5">{inq.subject || inq.message}</p>
                    </div>
                    <div className="text-xs text-[#64748B] shrink-0 font-medium">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
