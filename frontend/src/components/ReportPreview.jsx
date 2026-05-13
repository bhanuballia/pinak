// src/components/ReportPreview.jsx
import React from "react";

/**
 * ReportPreview
 * - fileUrl: string (URL to PDF blob or backend endpoint)
 * If fileUrl is null, shows placeholder message.
 */

export default function ReportPreview({ fileUrl }) {
  if (!fileUrl) {
    return (
      <div className="py-6 text-center text-gray-500">
        No report generated yet. After you submit the form, PDF preview and download link will appear here.
      </div>
    );
  }
  return (
    <div className="mt-4 border rounded overflow-hidden">
      <iframe
        title="Kundali report preview"
        src={fileUrl}
        style={{ width: "100%", height: "600px", border: "none" }}
      />
    </div>
  );
}

