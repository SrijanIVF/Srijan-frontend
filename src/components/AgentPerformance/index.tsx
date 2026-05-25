import React, { useEffect, useState, type FormEvent } from "react";
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  UserCheck,
  Clock,
  Zap,
  //   Filter,
  RefreshCw,
  User,
} from "lucide-react";
import { API_BASE, getToken } from "@/lib/auth";

export default function AgentsPerformance(): React.JSX.Element {
  const [analyticsData, setAnalyticsData] = useState({ results: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = () => {
    setLoading(true);
    const ctrl = new AbortController();
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const params = new URLSearchParams();

    // params.append("start_date", new Date().toISOString().split("T", 1)[0]);
    // params.append("end_date", new Date().toISOString().split("T", 1)[0]);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/communication/agent-performance/?${params.toString()}`,
          {
            signal: ctrl.signal,
            headers,
          },
        );
        if (res.status === 401) {
          return;
        }
        if (!res.ok) return;
        const json = await res.json();
        setAnalyticsData(json);
        setLoading(false);
      } catch {
        /* ignore */
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0s";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Compiling real-time system analytics...
          </p>
        </div>
      </div>
    );
  }

  const roleContext = "agent";
  const records = analyticsData?.results || [];

  return (
    <div className="bg-slate-50/50 px-6 md:p-2 font-sans text-slate-900">
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Call Operations
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
              <User className="h-3 w-3" />
              Personal Performance
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Monitor agent calling execution queues, answering velocities, and
            lead reach indices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAnalytics()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {roleContext === "agent" && records.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Assigned Calls
              </p>
              <div className="rounded-lg bg-slate-50 p-2 text-slate-600">
                <Phone className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {records[0].summary.total_calls}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Answering Success Rate
              </p>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {records[0].summary.answer_rate_percentage}%
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Unique Leads Engaged
              </p>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {records[0].summary.unique_leads_contacted}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Cumulative Talk Time
              </p>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatDuration(
                records[0].performance_durations.total_talk_time_seconds,
              )}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-semibold text-slate-800">
            Performance Breakdown Matrix
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {records.length} items evaluated
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <PhoneCall className="h-8 w-8 mx-auto stroke-1 mb-2" />
            <p className="text-sm font-medium">
              No performance analytics logs match this filter permutation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-[200px] border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-[bottom_1px_rgba(0,0,0,0.05)]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-6 bg-slate-50">Agent Information</th>
                  <th className="py-3.5 px-4 text-center bg-slate-50">
                    Volume Metrics
                  </th>
                  <th className="py-3.5 px-4 bg-slate-50">Answering Profile</th>
                  <th className="py-3.5 px-4 bg-slate-50">Direction Mapping</th>
                  <th className="py-3.5 px-4 bg-slate-50">
                    Answering Latencies
                  </th>
                  <th className="py-3.5 px-6 text-right bg-slate-50">
                    Talk Duration Log
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {records.map((row) => (
                  <tr
                    key={row.agent_info.id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">
                        {row.agent_info.full_name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        @{row.agent_info.username} • {row.agent_info.email}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs">
                        {row.summary.total_calls} Calls
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {row.summary.unique_leads_contacted} unique patients
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(row.summary.answer_rate_percentage, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="font-medium text-slate-800">
                          {row.summary.answer_rate_percentage}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Ans:{" "}
                        <span className="text-slate-700 font-medium">
                          {row.call_status_breakdown.answered}
                        </span>{" "}
                        • Missed:{" "}
                        <span className="text-slate-700 font-medium">
                          {row.call_status_breakdown.missed}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <PhoneCall className="h-3 w-3 text-sky-500" />
                          <span>
                            Incoming:{" "}
                            <strong>
                              {row.call_direction_breakdown.incoming}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <PhoneForwarded className="h-3 w-3 text-emerald-500" />
                          <span>
                            Outbound API:{" "}
                            <strong>
                              {row.call_direction_breakdown.outgoing_api}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">
                        {
                          row.performance_durations
                            .avg_agent_ring_latency_seconds
                        }
                        s
                      </div>
                      <div className="text-xs text-slate-400">
                        avg agent ring delay
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="font-semibold text-slate-900">
                        {formatDuration(
                          row.performance_durations.total_talk_time_seconds,
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Avg/Ans Call:{" "}
                        {row.performance_durations.avg_talk_time_seconds}s
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
