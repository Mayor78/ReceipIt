import React from "react";
import { pdf } from "@react-pdf/renderer";
import TestPDF from "./TestPDF";

const PdfTestPage = () => {
  const generateAndOpenPDF = async () => {
    try {
      const blob = await pdf(<TestPDF />).toBlob();

      // 🔥 This line alone tells us everything
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      // cleanup later
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("PDF TEST FAILED:", err);
      alert("PDF generation failed. Check console.");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>PDF Test</h1>
      <button
        onClick={generateAndOpenPDF}
        style={{
          padding: "12px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Generate Test PDF
      </button>
    </div>
  );
};

export default PdfTestPage;
