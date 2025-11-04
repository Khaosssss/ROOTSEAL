import React, { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";

function CertificateForm() {
  const [form, setForm] = useState({
    fullName: "",
    courseName: "",
    dateOfIssue: "",
    certificateId: "",
    organizerName: "",
    signatureName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ 1️⃣ Combine data for hashing
      const combinedData =
        form.fullName +
        form.courseName +
        form.dateOfIssue +
        form.certificateId +
        form.organizerName +
        form.signatureName;

      // ✅ 2️⃣ Compute Keccak256 hash (same as Solidity keccak256)
      const certificateHash = keccak256(toUtf8Bytes(combinedData));

      // ✅ 3️⃣ Store certificate data in localStorage
      localStorage.setItem("cert_" + certificateHash, JSON.stringify(form));

      // ✅ 4️⃣ Send hash to backend
      const res = await fetch("http://localhost:5000/api/addCertificateHash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateHash }),
      });

      if (!res.ok) {
        throw new Error("Failed to send hash to backend");
      }

      // ✅ 5️⃣ Redirect to CertificateViewer
      window.location.href = `/certificate?hash=${certificateHash}`;
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Failed to submit certificate: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-6">Generate Certificate</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-[90%] max-w-lg"
      >
        {Object.keys(form).map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-300 capitalize mb-1">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "dateOfIssue" ? "date" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Generating..." : "Generate Certificate"}
        </button>
      </form>
    </div>
  );
}

export default CertificateForm;
