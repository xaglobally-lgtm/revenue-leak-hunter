import React, { useEffect, useState } from 'react';
import { Download, Plus, Printer, FileBarChart2 } from 'lucide-react';
import { Report } from '../types.ts';
import { rlhFetch } from '../lib/api.ts';
import { useApp } from '../context/AppContext.tsx';

export const ReportsView: React.FC = () => {
  const { formatMoney, activeOrgId } = useApp();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const res = await rlhFetch<{ data: Report[] }>('/api/v1/reports', undefined, activeOrgId);
      if (res.ok && res.data?.data) setReports(res.data.data);
    } catch {
      // keep existing list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrgId]);

  const handleDownloadCSV = (rep: Report) => {
    const csvRows = [
      ['Report ID', 'Period', 'Potential Identified ($)', 'Verified ($)', 'Recovered ($)', 'RLH Fee ($)', 'Net Benefit ($)', 'Generated At'],
      [
        rep.id,
        `${new Date(rep.periodStart).toLocaleDateString()} - ${new Date(rep.periodEnd).toLocaleDateString()}`,
        rep.identifiedAmount,
        rep.verifiedAmount,
        rep.recoveredAmount,
        rep.feeAmount,
        rep.netBenefit,
        new Date(rep.generatedAt).toISOString(),
      ],
    ];

    const csvString = csvRows.map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.id}-audit-report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    try {
      const res = await rlhFetch<{ data: Report }>(
        '/api/v1/reports/monthly/generate',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        activeOrgId
      );
      if (res.ok && res.data?.data) {
        const newRep = res.data.data;
        setReports(prev => [newRep, ...prev]);
        setSelectedReport(newRep);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-sm text-slate-500">
            Audit-ready monthly recovery statements, attribution summaries, and fee schedules.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/Revenue-Leak-Hunter-Documentation.docx"
            download="Revenue-Leak-Hunter-Documentation.docx"
            className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            title="Download Word Document documentation"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Word Guide (.DOCX)</span>
          </a>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Audit Report</span>
          </button>
        </div>
      </div>

      {/* Reports Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Generated Executive Reports</h2>
          <span className="text-xs text-slate-500">
            {loading ? 'Loading…' : `${reports.length} statements`}
          </span>
        </div>

        {reports.length === 0 && !loading ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No reports generated yet. Click &quot;Generate New Audit Report&quot; to create one from live tenant data.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {reports.map(rep => (
              <div
                key={rep.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Recovery Report — {new Date(rep.periodEnd).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {new Date(rep.periodStart).toLocaleDateString()} - {new Date(rep.periodEnd).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {rep.findingsCount} findings &bull; {rep.verifiedCount} verified &bull; {rep.recoveredCount} recovered &bull; Generated{' '}
                    {new Date(rep.generatedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recovered</span>
                    <span className="font-bold text-emerald-800 text-sm">{formatMoney(rep.recoveredAmount)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">RLH Fee</span>
                    <span className="font-medium text-slate-800 text-sm">{formatMoney(rep.feeAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(rep)}
                      className="px-3 py-1.5 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => handleDownloadCSV(rep)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                      title="Download Audit Report (CSV)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Report Modal (Section 18) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-700">
                  Executive Recovery Statement
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Recovery Report — {new Date(selectedReport.periodEnd).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-xs text-slate-500">
                  {new Date(selectedReport.periodStart).toLocaleDateString()} - {new Date(selectedReport.periodEnd).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Section 1: Executive Summary */}
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
                  1. Executive Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500">Potential Identified</span>
                    <p className="text-base font-bold text-slate-900 mt-1">{formatMoney(selectedReport.identifiedAmount)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500">Verified by Team</span>
                    <p className="text-base font-bold text-blue-700 mt-1">{formatMoney(selectedReport.verifiedAmount)}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-800 font-semibold">Recovered Cash</span>
                    <p className="text-base font-extrabold text-emerald-950 mt-1">{formatMoney(selectedReport.recoveredAmount)}</p>
                  </div>
                  <div className="p-3 bg-slate-900 text-white rounded-xl">
                    <span className="text-emerald-400 font-semibold">RLH Fee (10%)</span>
                    <p className="text-base font-extrabold text-white mt-1">{formatMoney(selectedReport.feeAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Fee Statement */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  2. Transparent Fee Attribution Statement
                </h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Under Revenue Leak Hunter&apos;s commercial terms, client organizations are invoiced exactly 10% of
                  verified attributable cash recovered within the 12-month post-correction window. Total fee liability
                  for this period is <strong className="text-slate-900">{formatMoney(selectedReport.feeAmount)}</strong>,
                  leaving a net retained benefit of{' '}
                  <strong className="text-emerald-800">{formatMoney(selectedReport.netBenefit)}</strong>.
                </p>
                <div className="text-[11px] text-slate-500">
                  <FileBarChart2 className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                  Report {selectedReport.id} &bull; {selectedReport.findingsCount} findings, {selectedReport.verifiedCount}{' '}
                  verified, {selectedReport.recoveredCount} paid.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};