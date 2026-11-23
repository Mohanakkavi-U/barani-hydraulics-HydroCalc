<div align="center">

<img src="public/logo.png" alt="Barani Hydraulics Logo" width="120"/>

# 🔧 HydroCalc — Barani Hydraulics

### *Professional Hydraulic Engineering Calculator Suite*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Electron](https://img.shields.io/badge/Electron-39-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org)
[![MUI](https://img.shields.io/badge/MUI-5.17-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

**A powerful desktop application for hydraulic engineering calculations — built for Barani Hydraulics India Private Limited.**

[🚀 Features](#-features) · [⚙️ Calculators](#️-calculators) · [🛠️ Tech Stack](#️-tech-stack) · [📦 Installation](#-installation) · [🖥️ Build EXE](#️-build-desktop-exe)

</div>

---

## 📸 Overview

HydroCalc is a **professional-grade desktop application** designed for hydraulic engineers at Barani Hydraulics India Private Limited. It provides a suite of precision calculators for day-to-day hydraulic engineering tasks — with beautiful export options for PDF, Excel, and CSV reports.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧮 **6 Calculators** | Complete suite for all hydraulic engineering needs |
| 📄 **PDF Export** | Generate professional branded reports instantly |
| 📊 **Excel Export** | Styled Excel sheets with headers & formatting |
| 📋 **CSV Export** | Lightweight data export for further analysis |
| 🖥️ **Desktop App** | Runs as a native Windows `.exe` via Electron |
| ⚡ **Fast & Offline** | No internet needed — runs fully offline |
| 🎨 **Modern UI** | Clean Material Design with smooth animations |

---

## ⚙️ Calculators

### 1. 🔩 Tonnage Calculator
> Calculate the pressing tonnage required for hydraulic press operations based on cylinder dimensions and pressure parameters.

### 2. 💧 Pump Flow & Motor HP Calculator
> Determine the required pump flow rate and motor horsepower for hydraulic circuits — essential for system design.

### 3. 📏 Tie Rod & Step Diameter Calculator
> Calculate tie rod area, load capacity, thread area, and thread load based on diameter, working stress, yield strength, and factor of safety.

### 4. ⚖️ Shaft / Plate Weight & Foundation Calculator
> Compute the weight of shafts or plates and determine the foundation requirements for hydraulic press installations.

### 5. 🏗️ Main Cylinder Assembly Calculator
> Full calculations for main cylinder assemblies including bore, rod, stroke, force, speed, and flow parameters.

### 6. 🔵 Die Cushion Cylinders Calculator
> Calculate die cushion cylinder specifications including cushion force, pressure, and cylinder dimensions.

---

## 🛠️ Tech Stack

```
Frontend       →  React 18 + TypeScript
Bundler        →  Vite 5
Desktop        →  Electron 39
UI Library     →  Material UI (MUI) v5
Styling        →  Tailwind CSS v3
Animations     →  Framer Motion
Icons          →  Lucide React + MUI Icons
Routing        →  React Router DOM v6
PDF Export     →  @react-pdf/renderer
Excel Export   →  ExcelJS
File Saving    →  FileSaver.js
```

---

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)

### Clone & Run

```bash
# 1. Clone the repository
git clone https://github.com/Mohanakkavi-U/barani-hydraulics-HydroCalc.git

# 2. Navigate to project folder
cd barani-hydraulics-HydroCalc

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open your browser at → **http://localhost:5173**

---

## 🖥️ Build Desktop EXE

To build a standalone Windows `.exe` installer:

```bash
# Step 1 — Build the web app first
npm run build

# Step 2 — Package as Windows EXE
npm run electron:build
```

> The installer will be generated in the **`build/`** folder.

### Quick Electron Preview (without installer)
```bash
npm run electron:dev
```

---

## 📁 Project Structure

```
barani-hydraulics-HydroCalc/
├── public/
│   └── logo.png                  # Company logo
├── src/
│   ├── components/
│   │   ├── TonnageCalculator.tsx
│   │   ├── TonnageResults.tsx
│   │   ├── PumpFlowCalculator.tsx
│   │   ├── PumpFlowCalculatorResult.tsx
│   │   ├── TieRod.tsx
│   │   ├── TieRodResults.tsx
│   │   ├── PlateWeightCalculator.tsx
│   │   ├── PlateWeightAndFoundationCalculatorResults.tsx
│   │   ├── MainCylinderCalculator.tsx
│   │   ├── MainCylinderResults.tsx
│   │   ├── DieCushionCalculator.tsx
│   │   ├── DieCushionResults.tsx
│   │   ├── CylinderCalculations.tsx
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── interfaces/
│   │   └── MainCylinderTypes.ts
│   ├── App.tsx
│   └── main.tsx
├── electron-main.cjs             # Electron entry point
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |
| `npm run electron` | Launch Electron (requires build) |
| `npm run electron:dev` | Build + Launch Electron |
| `npm run electron:build` | Build + Package Windows EXE |

---

## 🏢 About

**Barani Hydraulics India Private Limited** is a leading manufacturer and supplier of hydraulic press machines and solutions. HydroCalc was developed to streamline engineering calculations and generate professional reports for clients.

---

## 📬 Contact

For queries, reach out to **Barani Hydraulics India Private Limited**.

---

<div align="center">

Made with ❤️ for **Barani Hydraulics India Private Limited**

⭐ If you find this useful, give it a star on [GitHub](https://github.com/Mohanakkavi-U/barani-hydraulics-HydroCalc)!

</div>
