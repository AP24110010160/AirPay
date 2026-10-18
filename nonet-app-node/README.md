# 📱 AirPay Mobile Node

The mobile client for **AirPay** — a decentralized Bluetooth Low Energy (BLE) mesh network client enabling gasless, offline cryptocurrency transactions across EVM blockchains (Flow EVM, Hedera, Ethereum).

---

## ⚡ Core Architecture

- **React Native & Expo SDK 54**: Modern mobile framework with file-based routing (`expo-router`).
- **BLE Mesh Engine (`contexts/BleContext.tsx`)**:
  - Operates as both BLE Peripheral (advertising fragmented 11-byte payloads) and BLE Central (scanning for peer packets).
  - Multi-hop chunk relaying and automatic ACK response propagation.
- **Offline Cryptographic Signatures (`contexts/WalletContext.tsx`)**:
  - Non-custodial ECDSA wallet generation with Keccak-256 address derivation.
  - Generates offline EIP-3009 `transferWithAuthorization` signatures.
- **Relayer & On-Chain Settlement (`lib/multiChainTransaction.ts`)**:
  - Internet-connected gateway nodes automatically submit transactions to Flow EVM Testnet (`0xc7a5Fd47Bc5725600E03124263056C897fb96b6c`).
- **Neo-Brutalism UI System (`components/NeoBrutalismComponents.tsx`)**:
  - High-contrast, brutalist design system tailored for fast, clear offline transaction management.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Expo Development Server
```bash
npm start
```

### 3. Run on Platforms
```bash
# Run on connected Android device or emulator
npm run android

# Run on Web (for UI component testing)
npm run web
```

---

## 📋 Required Permissions

The app requests:
- **Bluetooth Scan & Advertise** (`BLUETOOTH_SCAN`, `BLUETOOTH_ADVERTISE`, `BLUETOOTH_CONNECT` on Android 12+)
- **Location Access** (`ACCESS_FINE_LOCATION`) required by Android OS for BLE beacon discovery
- **Camera** (`CAMERA`) for QR code address scanning

---

## 📂 Project Structure

```
nonet-app-node/
├── app/                        # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard & Wallet Balance
│   │   ├── mesh.tsx           # BLE Mesh Network Status & Nodes
│   │   └── show.tsx           # Transaction History & Receipts
│   ├── transaction.tsx        # Offline Transaction Sender
│   ├── welcome.tsx            # Welcome & Onboarding
│   └── wallet-demo.tsx        # Wallet Key Management
├── components/                # UI Components
│   ├── NeoBrutalismComponents.tsx
│   └── TransactionLoader.tsx  # Broadcast & Mesh ACK tracker
├── contexts/                  # React State Contexts
│   ├── BleContext.tsx         # BLE Mesh networking engine
│   └── WalletContext.tsx      # Secure wallet & signature generation
├── lib/                       # Blockchain & Relayer interaction
│   └── multiChainTransaction.ts
└── utils/                     # BLE byte encoding & OS permissions
    ├── bleUtils.ts
    └── permissions.ts
```
