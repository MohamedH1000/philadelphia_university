"use client";
import { Button } from "@/components/ui/button";
import React from "react";

const DownloadTrainingPdf = () => {
  const pdfUrls = [
    "/files/myfile.pdf",
    "/files/myfile1.pdf",
    "/files/myfile2.pdf", // Add more file URLs as needed
    "/files/myfile3.pdf", // Add more file URLs as needed
    "/files/myfile4.pdf", // Add more file URLs as needed
  ];
  const handleDownload = () => {
    pdfUrls.forEach((pdfUrl, index) => {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `file${index + 1}.pdf`; // Name the files uniquely
      document.body.appendChild(link); // Append the link to the body (necessary for some browsers)
      link.click(); // Simulate a click to trigger download
      document.body.removeChild(link); // Clean up the DOM
    });
  };
  return (
    <div className="mt-5">
      <Button
        onClick={handleDownload}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        تحميل الملفات
      </Button>
    </div>
  );
};

export default DownloadTrainingPdf;
