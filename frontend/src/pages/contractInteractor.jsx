import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import RootSeal from "../RootSeal.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Auto-load later via deploy script ideally

console.log("Yes");




function App() {
  const [merkleRoot, setMerkleRoot] = useState("");
  const [description, setDescription] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");

  // ✅ Connect MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected!", { autoClose: 4000 });
        return;
      }

      const [acc] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(acc);
      toast.success("Wallet connected successfully!");
    } catch (err) {
      console.error("Wallet connection error:", err);
      toast.error("Failed to connect wallet.");
    }
  };

  // ✅ Load Contract Data
  const loadContractData = async () => {
    try {
      setLoading(true);

      if (!window.ethereum) {
        toast.error("Ethereum provider not found!");
        return;
      }

      if (!RootSeal?.abi) {
        toast.error("ABI not loaded properly. Check your ABI file path!");
        return;
      }

      if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        toast.error("Invalid contract address!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RootSeal.abi, provider);

      const root = await contract.merkleRoot();
      const desc = await contract.description();
      const locked = await contract.isLocked();

      setMerkleRoot(root);
      setDescription(desc);
      setIsLocked(locked);

      toast.success("Contract data loaded successfully!");
    } catch (error) {
      console.error("Error loading contract data:", error);
      toast.error("Failed to load contract data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
    loadContractData();
  }, []);

  return (
    <div
      style={{
        fontFamily: "monospace",
        background: "#0d1117",
        color: "white",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1>🌿 RootSeal Dashboard</h1>
      <p>
        <strong>Connected Account:</strong>{" "}
        {account || "Not connected"}
      </p>

      <button
        onClick={loadContractData}
        style={{
          margin: "1rem 0",
          padding: "0.6rem 1rem",
          cursor: "pointer",
          background: "#238636",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        🔄 Refresh Data
      </button>

      {loading ? (
        <p>Loading contract data...</p>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Merkle Root:</strong> {merkleRoot}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Locked:</strong> {isLocked ? "✅ Yes" : "❌ No"}</p>
        </div>
      )}

      {/* ✅ Toast Container */}
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}

export default App;
