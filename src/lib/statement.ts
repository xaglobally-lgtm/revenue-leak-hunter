import { RLH_FEE_PERCENT } from './fee.ts';

function esc(s: string | number | null | undefined): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface StatementLine {
  date: string;
  externalId: string;
  description: string;
  amount: string;
  fee: string;
}

export interface FeeStatementData {
  invoiceNo: string;
  issueDate: string;
  periodEnd: string;
  customerName: string;
  recoveryTitle: string;
  attributionWindow: string;
  recoveredTotal: string;
  feeTotal: string;
  netTotal: string;
  currencyLabel: string;
  lines: StatementLine[];
}

export function buildFeeStatementHtml(d: FeeStatementData): string {
  const rows = d.lines.length
    ? d.lines
        .map(
          l => `
        <tr>
          <td>${esc(l.date)}</td>
          <td class="mono">${esc(l.externalId)}</td>
          <td>${esc(l.description)}</td>
          <td class="num">${esc(l.amount)}</td>
          <td class="num">${esc(l.fee)}</td>
        </tr>`
        )
        .join('')
    : `
        <tr>
          <td>${esc(d.periodEnd)}</td>
          <td class="mono">&mdash;</td>
          <td>Attributable recovery to date</td>
          <td class="num">${esc(d.recoveredTotal)}</td>
          <td class="num">${esc(d.feeTotal)}</td>
        </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Revenue Leak Hunter &mdash; Client Fee Statement ${esc(d.invoiceNo)}</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; }
  .sheet { max-width: 760px; margin: 0 auto; }
  .brand { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #10b981; padding-bottom: 16px; }
  .brand-name { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
  .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
  .badge { font-size: 11px; font-weight: 700; color: #047857; background: #d1fae5; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 999px; }
  h1 { font-size: 22px; margin: 26px 0 4px; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 4px; line-height: 1.7; }
  .meta b { color: #0f172a; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 14px; }
  th { text-align: left; background: #f1f5f9; padding: 8px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; }
  td { padding: 8px 10px; border-top: 1px solid #e2e8f0; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; }
  .summary { width: 100%; margin-top: 8px; font-size: 13px; }
  .summary td { padding: 9px 10px; }
  .grand { border-top: 2px solid #0f172a; font-weight: 800; background: #f8fafc; }
  .net { border-top: 2px solid #10b981; background: #ecfdf5; font-weight: 800; }
  .muted { color: #64748b; }
  .foot { margin-top: 30px; font-size: 11px; color: #64748b; line-height: 1.65; border-top: 1px solid #e2e8f0; padding-top: 14px; }
  .foot b { color: #334155; }
  @media print { body { padding: 10mm; } .print-btn { display: none; } }
  .print-btn { margin-top: 24px; }
</style>
</head>
<body>
<div class="sheet">
  <div class="brand">
    <div>
      <div class="brand-name">Revenue Leak Hunter</div>
      <div class="brand-sub">Deterministic revenue-recovery attribution &amp; contingency billing</div>
    </div>
    <span class="badge">${RLH_FEE_PERCENT}% Contingency &mdash; Success Only</span>
  </div>

  <h1>Client Fee Statement</h1>
  <div class="meta">
    Invoice <b>${esc(d.invoiceNo)}</b> &bull; Issued <b>${esc(d.issueDate)}</b> &bull; Billing period ending <b>${esc(d.periodEnd)}</b><br />
    Client: <b>${esc(d.customerName)}</b> &bull; Opportunity: ${esc(d.recoveryTitle)}<br />
    Attribution window: <b>${esc(d.attributionWindow)}</b>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:22%">Date</th>
        <th style="width:24%">Payment Ref</th>
        <th>Description</th>
        <th class="num">Recovered</th>
        <th class="num">RLH Fee</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <table class="summary">
    <tr>
      <td>Total cash actually recovered (${esc(d.currencyLabel)})</td>
      <td class="num muted">&mdash;</td>
      <td class="num">${esc(d.recoveredTotal)}</td>
    </tr>
    <tr>
      <td>Revenue Leak Hunter fee &mdash; ${RLH_FEE_PERCENT}%, earned on recovery only</td>
      <td class="num muted">&mdash;</td>
      <td class="num">${esc(d.feeTotal)}</td>
    </tr>
    <tr class="grand">
      <td>Amount due on this statement</td>
      <td class="num muted">&mdash;</td>
      <td class="num">${esc(d.feeTotal)}</td>
    </tr>
    <tr class="net">
      <td>Net cash retained by client &mdash; ${100 - RLH_FEE_PERCENT}%</td>
      <td class="num muted">&mdash;</td>
      <td class="num">${esc(d.netTotal)}</td>
    </tr>
  </table>

  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

  <div class="foot">
    <p><b>Good for payment.</b> Fees are earned solely on incremental cash actually received and attributed to this verified opportunity. No fees are charged on unrealized potential. Please remit <b>${esc(d.feeTotal)}</b> within 15 days via ACH, wire, or card to Revenue Leak Hunter, quoting invoice <b>${esc(d.invoiceNo)}</b> as reference.</p>
    <p>Statement generated by Revenue Leak Hunter. This document certifies the contingency fee owed under the attribution agreement between the parties.</p>
  </div>
</div>
</body>
</html>`;
}