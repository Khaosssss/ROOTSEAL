import React, { useState, useEffect } from "react";
import { sha3_256 } from "js-sha3";

function CertificateForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    courseName: "",
    dateOfIssue: "",
    certificateId: "",
    organizerName: "",
    signatureName: "",
  });

  const [messages, setMessages] = useState({
    error: "",
    validating: false,
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle certificate submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, courseName, dateOfIssue, certificateId, organizerName, signatureName } =
      formData;

    const dataString =
      fullName + courseName + dateOfIssue + certificateId + organizerName + signatureName;
    const certificateHash = sha3_256(dataString);

    const certificateData = { ...formData };
    localStorage.setItem("cert_" + certificateHash, JSON.stringify(certificateData));

    Object.entries(formData).forEach(([key, value]) =>
      localStorage.setItem(key, value)
    );

    window.location.href = `/certificate.html?hash=${certificateHash}`;
  };

  // ✅ URL param reader
  const getUrlParameter = (name) => {
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : "";
  };

  // ✅ Validate hash from URL and auto-fill form
  const validateAndFillForm = () => {
    const hash = getUrlParameter("hash");
    if (!hash) return;

    setMessages({ validating: true, error: "" });

    const certificateData = localStorage.getItem("cert_" + hash);
    if (!certificateData) return showError();

    try {
      const data = JSON.parse(certificateData);
      const dataString =
        data.fullName +
        data.courseName +
        data.dateOfIssue +
        data.certificateId +
        data.organizerName +
        data.signatureName;
      const computedHash = sha3_256(dataString);

      if (computedHash === hash) {
        setFormData(data);
        setMessages({ validating: false, error: "" });

        setTimeout(() => handleSubmit(new Event("submit")), 500);
      } else {
        showError();
      }
    } catch {
      showError();
    }
  };

  const showError = () => {
    setMessages({ validating: false, error: "Invalid QR Code! Could not verify certificate." });
    const newUrl =
      window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  };

  useEffect(() => {
    validateAndFillForm();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-300 py-10 flex flex-col items-center">
      <h2 className="text-5xl font-extrabold text-indigo-900 mb-8 text-center">
        CERTIFICATE CREATION
      </h2>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h4 className="text-center text-xl font-semibold text-gray-800 mb-2">
          ENTER YOUR DETAILS
        </h4>
        <hr className="w-1/2 mx-auto border-gray-300 mb-6" />

        {messages.error && (
          <div className="text-red-700 bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-4 text-center">
            <strong>Invalid QR Code!</strong> {messages.error}
          </div>
        )}

        {messages.validating && (
          <div className="text-blue-700 bg-blue-100 border-2 border-blue-400 rounded-xl p-4 mb-4 text-center">
            <strong>Validating certificate...</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {[
            { id: "fullName", placeholder: "Full Name" },
            { id: "courseName", placeholder: "Course/Event Name" },
            { id: "dateOfIssue", placeholder: "Date of Issue", type: "date" },
            { id: "certificateId", placeholder: "Certificate ID or Roll Number" },
            { id: "organizerName", placeholder: "Organizer/Institution Name" },
            { id: "signatureName", placeholder: "Signature Name or Designation" },
          ].map(({ id, placeholder, type = "text" }) => (
            <input
              key={id}
              type={type}
              id={id}
              value={formData[id]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className="w-full px-4 py-3 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}

          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-2xl bg-indigo-700 hover:bg-indigo-800 transition-all duration-200 text-white font-semibold shadow-md"
          >
            Get Dummy Certificate
          </button>
        </form>
      </div>
    </div>
  );
}

export default CertificateForm;
