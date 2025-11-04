import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { keccak256, toUtf8Bytes } from "ethers";

const CertificateViewer = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const certRef = useRef();

  // ✅ Helper: get URL param
  const getUrlParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  // ✅ Format date (YYYY-MM-DD → readable)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ Load certificate from localStorage
  useEffect(() => {
    const hash = getUrlParam("hash");
    let certData = null;

    if (hash) {
      const stored = localStorage.getItem("cert_" + hash);
      if (stored) certData = JSON.parse(stored);
      else setError("Certificate not found. Please generate a new one.");
    } else {
      // fallback: legacy localStorage
      const fields = [
        "fullName",
        "courseName",
        "dateOfIssue",
        "certificateId",
        "organizerName",
        "signatureName",
      ];
      const temp = {};
      fields.forEach((f) => (temp[f] = localStorage.getItem(f)));
      if (Object.values(temp).every((v) => v)) {
        // ✅ Use keccak256 for hash
        const combinedData =
          temp.fullName +
          temp.courseName +
          temp.dateOfIssue +
          temp.certificateId +
          temp.organizerName +
          temp.signatureName;

        const hashCalc = keccak256(toUtf8Bytes(combinedData));

        localStorage.setItem("cert_" + hashCalc, JSON.stringify(temp));
        const newUrl =
          window.location.origin + window.location.pathname + "?hash=" + hashCalc;
        window.history.replaceState({}, "", newUrl);
        certData = temp;
      } else {
        setError("No certificate data found.");
      }
    }

    if (certData) {
      setData(certData);
    }
  }, []);

  // ✅ Generate QR code after render
  useEffect(() => {
    const generateQR = async () => {
      if (!data) return;
      const hash = getUrlParam("hash");
      const qrUrl =
        window.location.origin +
        window.location.pathname.replace("certificate", "form") +
        "?hash=" +
        hash;
      const canvas = document.getElementById("qrCodeCanvas");
      await QRCode.toCanvas(canvas, qrUrl, { width: 120 });
    };
    generateQR();
  }, [data]);

  // ✅ Download as PDF
  const handleDownload = async () => {
    const canvas = await html2canvas(certRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("certificate.pdf");
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 text-lg font-semibold">
        ❌ {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 text-lg">
        Loading certificate...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 min-h-screen py-10 flex flex-col items-center">
      <div
        ref={certRef}
        className="relative bg-white border-8 border-orange-600 rounded-2xl p-10 text-center w-[90%] max-w-3xl shadow-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 tracking-tight">
          Certificate of Participation
        </h1>
        <i className="fa fa-certificate text-[100px] text-orange-600 mb-4 drop-shadow-lg"></i>
        <h2 className="text-3xl uppercase font-semibold text-gray-900">
          {data.fullName}
        </h2>
        <h3 className="text-lg text-gray-700 mt-2">
          has successfully participated in
        </h3>
        <h2 className="text-2xl font-semibold text-blue-700 mt-2">
          {data.courseName}
        </h2>

        <div className="mt-6 text-gray-800 space-y-1">
          <p>Certificate ID: {data.certificateId}</p>
          <p>Date of Issue: {formatDate(data.dateOfIssue)}</p>
        </div>

        <div className="mt-10">
          <p className="text-lg">{data.signatureName}</p>
          <hr className="w-48 mx-auto border-gray-600" />
          <p className="text-sm">Signature</p>
        </div>

        <p className="mt-6 text-gray-700 italic">{data.organizerName}</p>

        <canvas
          id="qrCodeCanvas"
          className="absolute bottom-5 right-5 w-28 h-28"
        ></canvas>
      </div>

      <button
        onClick={handleDownload}
        className="mt-8 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      >
        Download PDF
      </button>
    </div>
  );
};

export default CertificateViewer;
