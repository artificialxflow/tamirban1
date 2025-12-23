"use client";

import { ReportsExportButton } from "./reports-export-button";

export function ReportsExportButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ReportsExportButton type="marketers" />
      <ReportsExportButton type="invoices" />
      <ReportsExportButton type="visits" />
      <ReportsExportButton type="customers" />
    </div>
  );
}

