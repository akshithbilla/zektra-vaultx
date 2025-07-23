import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ModalBody, Spinner } from "@heroui/react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
// Setup PDF.js worker (put this at the top level of your file, before your component)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function ModalBodyWithReactPDF({
  isPreviewLoading,
  previewContent,
  previewFile,
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Helper: is PDF
  const isPDF =
    previewFile?.contentType?.includes("pdf") ||
    previewFile?.type?.includes("pdf");

  // Helper: is Image
  const isImage =
    previewFile?.contentType?.includes("image") ||
    previewFile?.type?.includes("image");

  // Helper: is Text
  const isText =
    previewFile?.contentType?.includes("text") ||
    previewFile?.type?.includes("text");

  // PDF.js file prop can be a URL or an object: { url, httpHeaders }
  // Here, previewContent is assumed to be a direct URL to the PDF file

  return (
    <ModalBody style={{
    maxHeight: '75vh',  // or '80vh'
    overflowY: 'auto',
    padding: 0, // Optional: tweak for your layout
  }}>
      {isPreviewLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : previewContent ? (
        isImage ? (
          <img
            src={previewContent}
            alt={previewFile.name}
            className="max-w-full max-h-[70vh] mx-auto"
          />
        ) : isPDF ? (
          <div className="flex flex-col items-center w-full">
            <Document
              file={previewContent}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex items-center justify-center h-64">
                  <Spinner size="lg" />
                </div>
              }
              error={
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h4 className="text-lg font-medium mt-4">
                    Failed to load PDF preview
                  </h4>
                  <p className="text-default-500 mt-2">
                    Please download the file to view.
                  </p>
                </div>
              }
              className="w-full flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                width={Math.min(window.innerWidth * 0.85, 650)}
                loading={
                  <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" />
                  </div>
                }
              />
            </Document>
            {numPages && numPages > 1 && (
              <div className="flex gap-3 items-center mt-2">
                <button
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                  onClick={() =>
                    setPageNumber((n) => Math.max(n - 1, 1))
                  }
                  disabled={pageNumber <= 1}
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                  onClick={() =>
                    setPageNumber((n) => Math.min(n + 1, numPages))
                  }
                  disabled={pageNumber >= numPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : isText ? (
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-[65vh]">
            {previewContent}
          </pre>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h4 className="text-lg font-medium mt-4">Preview not available</h4>
            <p className="text-default-500 mt-2">
              This file type cannot be previewed. Please download to view.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h4 className="text-lg font-medium mt-4">Preview not available</h4>
          <p className="text-default-500 mt-2">
            This file type cannot be previewed. Please download to view.
          </p>
        </div>
      )}
    </ModalBody>
  );
}

export default ModalBodyWithReactPDF;