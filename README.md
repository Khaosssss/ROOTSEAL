# RootSeal — Blockchain-based Certificate System

RootSeal is a decentralized certificate management system that uses Merkle Trees and Ethereum smart contracts to securely store and verify digital certificates.  
It includes a React (Vite + Tailwind) frontend and an Express + Hardhat backend.

---

## Features

- Certificate creation and hashing using `keccak256`
- Merkle tree generation for certificate batches
- Certificate verification through stored Merkle roots
- Blockchain integration via Hardhat and Ethers.js
- Modern frontend built with React and Tailwind CSS

---

## Tech Stack

| Layer | Technologies |
|-------|---------------|
| Frontend | React (Vite), Tailwind CSS, React Router |
| Backend | Node.js, Express, MerkleTreeJS, Ethers.js |
| Blockchain | Solidity, Hardhat, Ethereum local node |
| Hashing | `keccak256` (Ethers) |

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/rootseal.git
cd rootseal
