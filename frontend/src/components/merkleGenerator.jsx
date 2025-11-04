import React, { useState, useEffect } from "react";

const MerkleGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    issueDate: "",
    certId: "",
  });
  const [status, setStatus] = useState("");
  const [root, setRoot] = useState(null);
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Load persisted data (root + proofs) from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("merkleData");
    if (savedData) {
      const { root, proofs } = JSON.parse(savedData);
      setRoot(root);
      setProofs(proofs);
    }
  }, []);

  // Persist data whenever root or proofs change
  useEffect(() => {
    if (root || proofs.length > 0) {
      localStorage.setItem("merkleData", JSON.stringify({ root, proofs }));
    }
  }, [root, proofs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(`${API_URL}/add-cert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Server Error");

      if (data.root) {
        // Tree completed
        setRoot(data.root);
        setProofs(data.proofs);
        setStatus("Merkle tree completed with 8 certificates ✅");
      } else {
        setStatus(
          `Certificate added (${data.currentCount}/8). Waiting for more...`
        );
      }

      // Reset form fields
      setFormData({ name: "", issueDate: "", certId: "" });
    } catch (error) {
      console.error("Error:", error);
      setStatus(`Error: ${error.message || "Submission failed"} ❌`);
    } finally {
      setLoading(false);
    }
  };

  // Determine color of status text
  const getStatusColor = () => {
    if (status.includes("Error")) return "text-red-600";
    if (status.includes("completed")) return "text-green-600";
    return "text-gray-700";
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Certificate Merkle Generator
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="certId"
          placeholder="Certificate ID"
          value={formData.certId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-800"
          }`}
        >
          {loading ? "Submitting..." : "Submit Certificate"}
        </button>
      </form>

      {/* Status */}
      {status && (
        <p className={`mt-4 text-sm font-medium ${getStatusColor()}`}>
          {status}
        </p>
      )}

      {/* Merkle Root */}
      {root && (
        <div className="mt-6 p-3 bg-white rounded shadow">
          <h2 className="font-semibold mb-1">Merkle Root</h2>
          <p className="break-all text-xs">{root}</p>
        </div>
      )}

      {/* Proofs */}
      {proofs.length > 0 && (
        <div className="mt-4 p-3 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Proofs (for each leaf)</h2>
          {proofs.map((p, i) => (
            <div key={i} className="mb-2">
              <p className="font-medium text-sm mb-1">Leaf {i + 1}:</p>
              <pre className="text-xs break-all bg-gray-100 p-2 rounded">
                {JSON.stringify(p, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerkleGenerator;
