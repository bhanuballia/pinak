import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function DeepHoroscopeViewer({ data, type }) {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  const titleMap = {
    'daily': 'Daily Horoscope (1 Page)',
    'monthly': 'Monthly Detailed Horoscope (30 Pages)',
    'yearly': 'Yearly Exhaustive Horoscope (50 Pages)'
  };

  const title = titleMap[type] || 'Detailed Horoscope';

  useEffect(() => {
    if (!data) return;

    let isMounted = true;

    const fetchStream = async () => {
      setIsGenerating(true);
      setError(null);
      setContent("");

      try {
        const response = await fetch('/api/horoscope-report/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chart_data: data,
            report_type: type
          })
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          if (isMounted) {
            const chunk = decoder.decode(value, { stream: true });
            setContent(prev => prev + chunk);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Stream error:", err);
          setError("Failed to generate report. The AI may be overloaded.");
        }
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    fetchStream();

    return () => {
      isMounted = false;
    };
  }, [data, type]);

  const handleDownloadPDF = async () => {
    // For a massive 30-50 page document, standard html2canvas will crash the browser.
    // The most robust method for massive documents is the native browser print to PDF.
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-amber-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div>
          <h1 className="text-2xl font-serif font-bold">{title}</h1>
          <p className="text-amber-200 text-sm">
            {isGenerating ? "✨ The Oracle is writing your personalized report... this may take several minutes." : "✅ Generation Complete"}
          </p>
        </div>
        <div className="flex gap-4">
          {!isGenerating && (
            <button
              onClick={handleDownloadPDF}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2 px-4 rounded shadow transition-colors flex items-center gap-2"
            >
              <span>📄</span> Save as PDF
            </button>
          )}
          <button
            onClick={() => window.close()}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded shadow"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex-grow p-8 flex justify-center print:p-0">
        <div
          ref={contentRef}
          className="bg-white w-full max-w-4xl p-10 rounded shadow-xl min-h-[80vh] prose prose-amber lg:prose-lg print:shadow-none print:p-0 print:max-w-full"
        >
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-6 border border-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="border-b-2 border-amber-200 mb-8 pb-4 text-center">
            <h1 className="text-4xl font-serif text-amber-900 mb-2">{title}</h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Prepared Exclusively For You</p>
          </div>

          <div className="markdown-body">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          {isGenerating && (
            <div className="mt-8 flex justify-center print:hidden">
              <div className="animate-pulse flex items-center gap-3 text-amber-600 font-bold">
                <span className="text-2xl">✍️</span>
                <span>Writing next section...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white; }
          .prose { max-width: 100% !important; }
          @page { margin: 2cm; }
          h2 { page-break-before: always; }
        }
      `}} />
    </div>
  );
}
