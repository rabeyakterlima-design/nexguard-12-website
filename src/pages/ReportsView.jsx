import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Printer, CheckCircle } from 'lucide-react';

export default function ReportsView() {
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const reports = [
    { id: 'security-audit', title: 'Comprehensive Security Posture Audit', desc: 'Holistic posture report covering all 12 modules, vulnerability findings, and compliance scores.', format: 'CSV / PDF' },
    { id: 'threat-telemetry', title: 'IOC & Threat Activity Report', desc: 'Blocked IP list, malicious domain telemetry, ransomware canary status, and kill-chain statistics.', format: 'CSV / PDF' },
    { id: 'device-compliance', title: 'Registered Endpoints Compliance', desc: 'Hardware Knox attestation, rooted device detection, disk encryption status, and app permissions audit.', format: 'CSV' },
    { id: 'audit-trail', title: 'Privileged Administrative Audit Trail', desc: 'Immutable timeline of every administrative action, suspension, role assignment, and system modification.', format: 'CSV' },
  ];

  const handleDownloadCsv = (reportId) => {
    setDownloading(true);
    window.open(`http://localhost:5000/api/reports/export/csv?type=${reportId}`, '_blank');
    setTimeout(() => {
      setDownloading(false);
      setFeedback(`Report ${reportId} exported successfully.`);
    }, 1000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-nexblue/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-nexcyan/20 text-nexcyan border border-nexcyan/30">
              AUDIT & COMPLIANCE INTELLIGENCE
            </span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">
            Enterprise Security Reports & Export Engine
          </h1>
          <p className="text-xs text-nexmuted">
            Export legally admissible forensic audit logs, IOC threat feeds, and device posture telemetry in standard formats.
          </p>
        </div>

        <button
          onClick={handlePrintPdf}
          className="px-4 py-2 rounded-lg bg-nexbg hover:bg-nexcard border border-nexblue/30 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4 text-nexcyan" /> Print / Save as PDF
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg text-xs font-mono bg-nexgreen/10 border border-nexgreen text-nexgreen flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.id} className="p-5 rounded-xl glass-panel flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-nexblue/20 text-nexcyan">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-nexbg border border-nexblue/20 text-nexcyan">
                  {r.format}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-3">{r.title}</h3>
              <p className="text-xs text-nexmuted mt-1 leading-relaxed">{r.desc}</p>
            </div>

            <div className="pt-3 border-t border-nexblue/10 flex items-center justify-between">
              <button
                onClick={() => handleDownloadCsv(r.id)}
                disabled={downloading}
                className="px-3 py-1.5 rounded-lg bg-nexblue hover:bg-nexblue/80 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
