"use client";
import { Button } from "@/components/ui/button";
import React from "react";

const DownloadPdf = () => {
  const pdfUrl = "/files/myfile.pdf"; // Update with the Vercel Blob URL or the path to your public folder

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "myfile.pdf"; // Name the file to be downloaded
    document.body.appendChild(link); // Append the link to the body (necessary for some browsers)
    link.click(); // Simulate a click to trigger download
    document.body.removeChild(link); // Clean up the DOM
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
        تحميل الملف
      </Button>
    </div>
  );
};

export default DownloadPdf;
