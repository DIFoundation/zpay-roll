import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export type ReceiptBatch = {
  _id: string;
  name: string;
  senderAddress: string;
  memo?: string;
  status: string;
  totalZec: number;
  recipientCount: number;
  operationId?: string;
  txIds?: string[];
  broadcastedAt?: string;
  completedAt?: string;
  _creationTime: number;
};

export type ReceiptRecipient = {
  _id: string;
  name?: string;
  address: string;
  amount: number;
  memo?: string;
  status: string;
};

export function generatePayrollReceipt(
  batch: ReceiptBatch,
  recipients: ReceiptRecipient[]
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  let y = margin;

  // ── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(30, 20, 60); // dark purple
  doc.rect(0, 0, pageW, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(240, 200, 60); // ZEC gold
  doc.text("ZEC Payroll", margin, 12);

  doc.setFontSize(8);
  doc.setTextColor(180, 170, 200);
  doc.text("ONCHAIN PAYROLL RECEIPT", margin, 19);

  doc.setFontSize(8);
  doc.setTextColor(180, 170, 200);
  const dateStr = format(new Date(), "MMM d, yyyy HH:mm 'UTC'");
  doc.text(`Generated: ${dateStr}`, pageW - margin, 19, { align: "right" });

  y = 36;

  // ── Batch Details ─────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 10, 40);
  doc.text(batch.name, margin, y);
  y += 7;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 70, 100);

  const details: [string, string][] = [
    ["Batch ID", batch._id],
    ["Status", batch.status.toUpperCase()],
    ["Created", format(new Date(batch._creationTime), "MMM d, yyyy HH:mm")],
    ...(batch.broadcastedAt
      ? [["Broadcast", format(new Date(batch.broadcastedAt), "MMM d, yyyy HH:mm")] as [string, string]]
      : []),
    ...(batch.completedAt
      ? [["Confirmed", format(new Date(batch.completedAt), "MMM d, yyyy HH:mm")] as [string, string]]
      : []),
    ["Sender Address", batch.senderAddress],
    ...(batch.memo ? [["Batch Memo", batch.memo] as [string, string]] : []),
  ];

  for (const [label, value] of details) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(value, pageW - margin * 2 - 35);
    doc.text(wrapped as string[], margin + 35, y);
    y += wrapped.length > 1 ? wrapped.length * 4.5 : 5.5;
  }

  y += 3;

  // ── Summary Box ───────────────────────────────────────────────────────────
  doc.setFillColor(245, 243, 255);
  doc.roundedRect(margin, y, pageW - margin * 2, 18, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 10, 40);
  doc.text("Total Amount", margin + 6, y + 7);
  doc.setFontSize(14);
  doc.setTextColor(80, 40, 180);
  doc.text(`${batch.totalZec.toFixed(4)} ZEC`, margin + 6, y + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(20, 10, 40);
  doc.text(`${batch.recipientCount} Recipients`, pageW / 2, y + 10, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80, 70, 100);
  doc.text(`Avg per recipient:`, pageW - margin - 40, y + 7);
  doc.setTextColor(80, 40, 180);
  doc.text(
    `${(batch.totalZec / Math.max(batch.recipientCount, 1)).toFixed(4)} ZEC`,
    pageW - margin - 40,
    y + 13
  );

  y += 24;

  // ── Transaction IDs ───────────────────────────────────────────────────────
  if (batch.txIds && batch.txIds.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20, 10, 40);
    doc.text("Transaction ID(s)", margin, y);
    y += 5;
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(60, 50, 120);
    for (const txId of batch.txIds) {
      doc.text(txId, margin, y);
      y += 4.5;
    }
    y += 3;
  }

  // ── Recipients Table ──────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 10, 40);
  doc.text("Recipients", margin, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Name", "Address", "Amount (ZEC)", "Status"]],
    body: recipients.map((r, i) => [
      String(i + 1),
      r.name ?? "—",
      r.address,
      r.amount.toFixed(4),
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
    ]),
    foot: [["", "", "TOTAL", batch.totalZec.toFixed(4), ""]],
    headStyles: {
      fillColor: [30, 20, 60],
      textColor: [240, 200, 60],
      fontSize: 8,
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [240, 235, 255],
      textColor: [40, 20, 120],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7, textColor: [30, 25, 50] },
    alternateRowStyles: { fillColor: [250, 248, 255] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      2: { cellWidth: 70, font: "courier", fontSize: 6 },
      3: { halign: "right", font: "courier" },
      4: { halign: "center", cellWidth: 20 },
    },
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 260;
  doc.setFontSize(7);
  doc.setTextColor(160, 150, 180);
  doc.text(
    "This receipt was automatically generated by ZEC Payroll · Zcash Onchain Payroll System",
    pageW / 2,
    finalY + 10,
    { align: "center" }
  );

  doc.save(`payroll-receipt-${batch._id.slice(-8)}.pdf`);
}
