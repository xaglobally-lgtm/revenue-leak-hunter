import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'Revenue Leak Hunter (RLH)',
            heading: HeadingLevel.TITLE,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'System Documentation, Operational Manual & Financial Guide',
                bold: true,
                size: 28,
                color: '059669',
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Generated for: Business Owners, Finance Teams, and Revenue Operations',
                italics: true,
                color: '64748B',
              }),
            ],
            spacing: { after: 400 },
          }),

          // SECTION 1: HOW THE MONEY GOES INTO YOUR BANK ACCOUNT
          new Paragraph({
            text: '1. How Does the Money Go Into Your Bank Account?',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Most Important Fact: Revenue Leak Hunter NEVER holds, touches, or routes your customer payments.',
                bold: true,
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'All revenue recovered flows 100% directly through your own Stripe merchant account into your own business checking account, exactly like your normal customer payments. Here is the step-by-step transaction journey:',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Step 1 — Detection: ', bold: true }),
              new TextRun({
                text: 'Revenue Leak Hunter flags an underbilled account (e.g., a customer using 31 seats but only paying for 25 seats, causing a $1,200/month shortfall).',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Step 2 — Correction in Stripe: ', bold: true }),
              new TextRun({
                text: 'Your team updates the customer’s subscription in your Stripe Dashboard (or applies the recommended fix).',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Step 3 — Customer Payment: ', bold: true }),
              new TextRun({
                text: 'On the next monthly billing cycle, Stripe automatically charges the customer’s credit card or bank account for the corrected amount ($3,100 instead of $2,500).',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Step 4 — Direct Deposit to Your Bank: ', bold: true }),
              new TextRun({
                text: 'Stripe deposits that collected cash straight into your company bank account via standard Stripe Payouts (usually within 2 business days via ACH/direct deposit).',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Step 5 — The 10% Performance Fee: ', bold: true }),
              new TextRun({
                text: 'Only after that extra $1,200 has been verified as paid into your bank, Revenue Leak Hunter logs the 10% success fee ($120) on your monthly statement. You retain 90% ($1,080) of pure found money.',
              }),
            ],
            spacing: { after: 250 },
          }),

          // SECTION 2: HOW TO USE THE PLATFORM
          new Paragraph({
            text: '2. How to Use Revenue Leak Hunter (Step-by-Step)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Day-to-day operation requires less than 15 minutes per week:' }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Ingest & Sync Data: ', bold: true }),
              new TextRun({
                text: 'Click "Sync Data" in the top header or "Run Engine Scan" in Opportunities. The platform inspects subscriptions, coupons, usage telemetry, and payment dunning status.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Review Identified Opportunities: ', bold: true }),
              new TextRun({
                text: 'Navigate to "Opportunities". Findings are sorted by estimated annual loss. Click "Inspect Evidence" to examine the exact arithmetic, user counts, and source invoice IDs.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Verify or Dismiss: ', bold: true }),
              new TextRun({
                text: 'Click "Verify Discrepancy" and confirm the authorization. This promotes the finding into your Recoveries ledger. If an exception was intentional (e.g. promotional giveaway), click "Reject" and choose a reason code.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Fix Billing & Record Cash: ', bold: true }),
              new TextRun({
                text: 'Adjust the customer subscription in Stripe. When subsequent invoices are paid, go to "Recoveries" and record the captured payment to track your 12-month recovered cash balance.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '5. Download Financial Statements: ', bold: true }),
              new TextRun({
                text: 'Go to the "Reports" tab to download executive CSV audit spreadsheets or print professional board-ready recovery summaries.',
              }),
            ],
            spacing: { after: 250 },
          }),

          // SECTION 3: GUIDE A - LAYMAN SPEAKING
          new Paragraph({
            text: '3. Guide A: Plain-English (Layman’s Guide)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'What is Revenue Leakage in Simple Terms?',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Imagine you own a gym or parking garage. A customer signs up for a 2-person family plan. Over the year, they add 3 more family members who use the gym daily. However, the computer at your front desk still charges them for only 2 people. Three people are working out for free every single month.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'In recurring subscription businesses, this happens constantly: team members add colleagues without updating the Stripe subscription; expired discount codes keep applying forever; or card failure notices get buried in spam folders. This is called "Revenue Leakage".',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'How Revenue Leak Hunter Helps You:',
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• 24/7 Digital Auditor: ', bold: true }),
              new TextRun({
                text: 'Constantly compares active user accounts against what Stripe is actually billing.',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Crystal-Clear Evidence: ', bold: true }),
              new TextRun({
                text: 'Shows the exact customer name, unbilled amount, and mathematical proof—no guesses.',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Exact Remediation Steps: ', bold: true }),
              new TextRun({
                text: 'Tells you exactly what button to click in Stripe to correct the invoice.',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Zero Risk: ', bold: true }),
              new TextRun({
                text: 'You only pay a 10% fee when money is actually collected into your bank. If you reject an alert, you pay $0.',
              }),
            ],
            spacing: { after: 250 },
          }),

          // SECTION 4: GUIDE B - FINANCE & REVOPS
          new Paragraph({
            text: '4. Guide B: Finance & RevOps Professional Guide',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Architecture & Reconciliation Mechanics',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Revenue Leak Hunter is a deterministic reconciliation layer connecting identity providers (Active Directory, Okta), usage meters, and the billing engine (Stripe, Chargebee, NetSuite).',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Decimal Minor-Unit Math (Zero Floating-Point Drift):',
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'To maintain strict general ledger parity and pass external audits, all calculations use integer minor units (cents) via Decimal.js. The 10% performance fee is evaluated strictly as: Fee_Liability = Floor((Collected_Attributable_Cash * 10) / 100).',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '12-Month Attribution Window:',
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Promoting an opportunity to "Verified" instantiates a fixed 365-day tracking window (recoveryStart to recoveryEnd). Only subsequent invoice collections within this interval qualify for fee attribution.',
              }),
            ],
            spacing: { after: 150 },
          }),

          // SECTION 5: DETECTOR REFERENCE TABLE
          new Paragraph({
            text: '5. Deterministic Detector Specifications',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Code', bold: true })] })],
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Detector Name', bold: true })] })],
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Domain', bold: true })] })],
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Trigger Condition', bold: true })] })],
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'PAY-001' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Failed Recurring Payment' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Dunning & Collections' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Invoice status OPEN > 3 days past due with failed charge.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'BILL-001' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Seat Discrepancy' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Provisioning' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Observed active directory users > subscription quantity.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'PRICE-001' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Expired Promotion' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Pricing Integrity' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Coupon code endDate is prior to invoice date but applied.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'INV-001' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Missing Cadence' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Billing Cadence' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Active recurring sub with no invoice >= 15 days past renewal.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'USAGE-001' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Unbilled Usage' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Consumption' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Sum of meter events exceeds billedQuantity on invoice.' })] }),
                ],
              }),
            ],
          }),

          // SECTION 6: HOW TO DOWNLOAD THE FILES
          new Paragraph({
            text: '6. How to Download Project & Documentation Files',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Full Source Code (ZIP / GitHub): ', bold: true }),
              new TextRun({
                text: 'In Google AI Studio, click the Settings / Menu icon in the top right, then select "Download ZIP" or "Export to GitHub".',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Word Document (.docx): ', bold: true }),
              new TextRun({
                text: 'Click the "Download Word Doc (.DOCX)" button in the in-app Documentation tab or in the Reports view.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Markdown Guide (.md): ', bold: true }),
              new TextRun({
                text: 'Stored directly in the root directory as DOCUMENTATION.md and downloadable via the web interface.',
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Financial CSV Audits: ', bold: true }),
              new TextRun({
                text: 'Download line-item audit spreadsheets from the Reports tab.',
              }),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  // Write to public directory for direct download in browser
  const publicPath = path.join(process.cwd(), 'public', 'Revenue-Leak-Hunter-Documentation.docx');
  fs.writeFileSync(publicPath, buffer);
  console.log('[DOCX] Written to:', publicPath);

  // Write to root directory as well
  const rootPath = path.join(process.cwd(), 'Revenue-Leak-Hunter-Documentation.docx');
  fs.writeFileSync(rootPath, buffer);
  console.log('[DOCX] Written to:', rootPath);
}

generateDocx().catch(console.error);
