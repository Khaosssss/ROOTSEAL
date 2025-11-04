import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "tailwindcss"
import Navbar from "./components/navbar";
import MerkleGenerator from "./components/merkleGenerator";
import CertificateForm from "./pages/CertificateForm";
import MerkleVerifier from "./pages/merkleVerifier";
import ContractInteractor from "./pages/contractInteractor";
import CertificateViewer from "./pages/certificateViewer";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pt-32">
      <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        RootSeal
      </h1>
      <p className="text-lg mb-8 text-gray-300 max-w-2xl leading-relaxed">
        A blockchain-powered certification system secured with Merkle Trees — 
        verify authenticity with confidence.
      </p>
      <div className="flex gap-4">
        <a
          href="/form"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200"
        >
          Create Certificate
        </a>
        <a
          href="/generator"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-200"
        >
          Generate Merkle Root
        </a>
      </div>

      <footer className="absolute bottom-6 text-gray-500 text-sm">
        © 2025 <span className="text-blue-400">RootSeal</span>. Built with 💙 on Blockchain.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<CertificateForm />} />
          <Route path="/generator" element={<MerkleGenerator />} />
          <Route path="/verifier" element={<MerkleVerifier />} />
          <Route path="/interact" element={<ContractInteractor />} />
          <Route path="/certificate" element={<CertificateViewer />} /> {/* ✅ new */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
