import React, { useState, useRef, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import Swal from "sweetalert2";

import { useReceipt } from "../context/ReceiptContext";
import ReceiptPDF from "./ReceiptPDF";
import BuyMeACoffeeModal from "./BuyMeACoffeeModal";

import ReceiptActions from "./receiptDisplay/ReceiptActions";
import MobileNotice from "./receiptDisplay/MobileNotice";
import PrintableReceipt from "./receiptDisplay/PrintableReceipt";
import ReceiptPreview from "./receiptDisplay/ReceiptPreview";

const ReceiptDisplay = () => {
  const {
    receiptData,
    companyLogo,
    savedReceipts,
    saveCurrentReceipt,
    calculateSubtotal,
    calculateDiscount,
    calculateVAT,
    calculateTotal,
    calculateChange,
    formatNaira,
  } = useReceipt();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const printableRef = useRef(null);

  /* ---------------- MOBILE DETECTION ---------------- */

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent || "";
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------- PDF GENERATION ---------------- */

  const generatePDFBlob = async (saveToHistory = true) => {
    setIsGenerating(true);

    try {
      const document = (
        <ReceiptPDF
          receiptData={receiptData}
          companyLogo={companyLogo}
          formatNaira={formatNaira}
          calculateSubtotal={calculateSubtotal}
          calculateDiscount={calculateDiscount}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
          calculateChange={calculateChange}
        />
      );

      const blob = await pdf(document).toBlob();

      // ❗ Save history only on desktop
      if (saveToHistory && !isMobile) {
        saveCurrentReceipt(blob);
      }

      return blob;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to generate receipt PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- DOWNLOAD (MOBILE SAFE) ---------------- */

  const handleDownloadPDF = async () => {
    Swal.fire({
      title: "Preparing Receipt",
      text: "Generating PDF…",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const blob = await generatePDFBlob(true);
      const fileName = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;

      if (isMobile && navigator.share) {
        // ✅ ONLY reliable mobile method
        const file = new File([blob], fileName, {
          type: "application/pdf",
        });

        await navigator.share({
          files: [file],
          title: "Receipt",
          text: "Generated receipt",
        });

        Swal.close();
      } else {
        // Desktop download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        Swal.fire("Downloaded", "Receipt saved successfully", "success");
      }

      showCoffeeModalIfAllowed();
    } catch (err) {
      Swal.fire("Download failed", err.message, "error");
    }
  };

  /* ---------------- PRINT (DESKTOP ONLY) ---------------- */

  const handlePrint = () => {
    if (isMobile) return;

    try {
      const win = window.open("", "_blank");
      if (!win) throw new Error("Popup blocked");

      win.document.write(`
        <html>
          <head><title>Print Receipt</title></head>
          <body>
            ${printableRef.current.innerHTML}
            <script>
              setTimeout(() => { window.print(); window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
      win.document.close();
    } catch (err) {
      Swal.fire("Print Error", err.message, "error");
    }
  };

  /* ---------------- COFFEE MODAL ---------------- */

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("coffeeModalLastShown");

    if (lastShown !== today) {
      localStorage.removeItem("coffeeModalShownToday");
      localStorage.setItem("coffeeModalLastShown", today);
    }
  }, []);

  const showCoffeeModalIfAllowed = () => {
    if (!localStorage.getItem("coffeeModalShownToday")) {
      setTimeout(() => setShowCoffeeModal(true), 1200);
      localStorage.setItem("coffeeModalShownToday", "true");
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6">
      <MobileNotice isMobile={isMobile} />

      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      <ReceiptActions
        onDownload={handleDownloadPDF}
        onPrint={!isMobile ? handlePrint : undefined}
        isGenerating={isGenerating}
        isMobile={isMobile}
        receiptData={receiptData}
        savedReceipts={savedReceipts}
        formatNaira={formatNaira}
        calculateTotal={calculateTotal}
      />

      {/* PRINT TEMPLATE */}
      <div ref={printableRef} className="hidden">
        <PrintableReceipt
          receiptData={receiptData}
          companyLogo={companyLogo}
          formatNaira={formatNaira}
          calculateSubtotal={calculateSubtotal}
          calculateDiscount={calculateDiscount}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
          calculateChange={calculateChange}
        />
      </div>

      {/* ONSCREEN RECEIPT PREVIEW (HTML, NOT PDF) */}
      <ReceiptPreview
        receiptData={receiptData}
        companyLogo={companyLogo}
        formatNaira={formatNaira}
        calculateSubtotal={calculateSubtotal}
        calculateVAT={calculateVAT}
        calculateTotal={calculateTotal}
      />
    </div>
  );
};

export default ReceiptDisplay;
