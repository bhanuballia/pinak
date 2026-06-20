// src/components/ReportPreview.jsx
// Renders a PDF blob URL onto an HTML Canvas via pdf.js so the browser
// never shows its native PDF toolbar (no download / print buttons).
// All DRM protections (no right-click, no copy, no Ctrl+P/S/C, PrintScreen blackout) are applied.
import React, { useEffect, useRef, useState } from "react";

export default function ReportPreview({ fileUrl }) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);

  // Load pdf.js from CDN dynamically once
  useEffect(() => {
    if (!fileUrl) return;

    const loadPdf = async () => {
      // Dynamically import pdf.js from CDN
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      try {
        const doc = await window.pdfjsLib.getDocument(fileUrl).promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to load PDF for preview:", err);
      }
    };

    loadPdf();
  }, [fileUrl]);

  // Render current page to canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  // DRM protections: applied to the preview container
  useEffect(() => {
    if (!fileUrl) return;

    const handleKeyDown = (e) => {
      // PrintScreen blackout
      if (e.key === "PrintScreen" || e.keyCode === 44 || (e.metaKey && e.shiftKey)) {
        navigator.clipboard?.writeText("Screenshots are disabled for this confidential report.");
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "black", zIndex: "999999",
        });
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 1500);
      }
      // Block Ctrl/Cmd + C, P, S, A
      if ((e.ctrlKey || e.metaKey) && ["c", "p", "s", "a"].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e) => e.preventDefault();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="py-6 text-center text-gray-500">
        No report generated yet. After you submit the form, PDF preview will appear here.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mt-4 border rounded overflow-hidden bg-gray-100"
      style={{
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Transparent overlay to block mouse-based drag-selection on the canvas */}
      <div
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 10,
          cursor: "default",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Page navigation */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 p-2 bg-gray-200 border-b text-sm font-medium text-gray-700" style={{ zIndex: 20, position: "relative" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-white rounded border shadow-sm disabled:opacity-40 hover:bg-gray-50"
          >
            ‹ Prev
          </button>
          <span>Page {currentPage} of {numPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="px-3 py-1 bg-white rounded border shadow-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Next ›
          </button>
        </div>
      )}

      {/* Canvas-rendered PDF page — no browser PDF toolbar */}
      <div className="flex justify-center overflow-auto" style={{ maxHeight: "700px" }}>
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            maxWidth: "100%",
            pointerEvents: "none",  // Prevents selection/drag on canvas
          }}
        />
      </div>

      {/* Print-blocking style: if they somehow trigger print, show blank */}
      <style>{`
        @media print { body { display: none !important; } }
      `}</style>
    </div>
  );
}


