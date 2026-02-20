# Campus Wallet - Student Payment System 🎓

> **Award-Winning Hackathon Project** | Algorand & AlgoKit

Campus Wallet is a decentralized student payment system built on the Algorand blockchain. It solves the problem of peer-to-peer campus transactions by providing a fast, secure, and transparent way for students to split bills, pay for events, and manage their finances using ALGO and ASAs, while also featuring an escrow service for secure agreements.

## 🚀 Live Demo & Links
- **Live Demo URL**: [Link to your deployed site, e.g., via Vercel/Netlify]
- **Demo Video**: [Link to public LinkedIn Video]
- **Testnet App ID**: `APP_ID_HERE` (See deployment logs)
- **Testnet Explorer**: [Pera Explorer Link]

## 🎯 Problem Statement
**Selected Project**: Project 1: Campus Wallet - Student Payment System

Traditional campus payments are often fragmented (Cash, Venmo, manual tracking). This project introduces students to blockchain technology by replacing manual ledgers with an immutable, fast, and low-cost payment rail on Algorand.

## ✨ Features
- **Wallet Integration**: Connect seamlessly with Pera Wallet or Defly (Pera Connect).
- **Real-Time Balance**: View your account balance in ALGO instantly.
- **Direct Payments**: Send ALGO to any address safely and quickly (finality < 4s).
- **Transaction History**: View your recent on-chain activity transparently.
- **Secure Escrow**: Create smart-contract backed escrow agreements for high-value items/services (e.g., selling textbooks, tickets).

## 🏗 Architecture Overview

The system is a dApp composed of:
1.  **Frontend (React + Vite)**: A modern, responsive UI built with Tailwind CSS and DaisyUI. It interacts with the blockchain using `algosdk` and manages wallet connections via `@txnlab/use-wallet-react`.
2.  **Smart Contract (Python/Algorand Python)**: A secure escrow contract written in Python using `algokit-utils` and `algopy`. It utilizes **Global State** for persistence and enforces strict security checks (e.g., `Txn.sender` validation).
3.  **Algorand Testnet**: All transactions and contracts are deployed and verified on the Algorand Testnet.

## 🛠 Tech Stack
-   **Blockchain**: Algorand (Testnet)
-   **Development Framework**: AlgoKit (v2.x)
-   **Smart Contract Language**: Python (Algorand Python / Puya)
-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, DaisyUI
-   **SDKs**: `algosdk`, `@txnlab/use-wallet`

## 📦 Installation & Setup

### Prerequisites
-   [Docker](https://www.docker.com/) (running)
-   [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli)
-   Node.js v18+

### Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/campus-wallet.git
    cd campuspay
    ```

2.  **Bootstrap Project**
    ```bash
    algokit project bootstrap all
    ```
    This installs all Python and Node.js dependencies and sets up the environment.

3.  **Start Local Network (Optional)**
    ```bash
    algokit localnet start
    ```

4.  **Deploy Smart Contracts**
    ```bash
    algokit project run build
    # Deploy to Testnet (requires account with ALGO)
    # Configure .env or use localnet default
    ```

5.  **Run Frontend**
    ```bash
    cd projects/campuspay-frontend
    npm run dev
    ```

## 📖 Usage Guide
1.  **Connect Wallet**: Click "Connect Wallet" and scan the QR code with Pera Mobile.
2.  **View Balance**: Your Balance is displayed on the dashboard.
3.  **Send Payment**: Click "Open Campus Wallet", enter a recipient address and amount, then sign the transaction.
4.  **Escrow**: Use the "Smart Contract" button to initiate a secure escrow (requires contract deployment).

## ⚠️ Known Limitations
-   Currently supports ALGO only (ASAs planned for v2).
-   Escrow requires manual claiming by receiver (UI for claiming in progress).

## 👥 Team
-   **[Your Name]**: Full Stack Developer (Smart Contract & Frontend)
