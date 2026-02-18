<div align="center">

<br/>

# 👁️ NeuralEye Enterprise

### Enterprise-Grade Real-Time Object Detection — Runs Entirely In Your Browser

<br/>

[![Version](https://img.shields.io/badge/version-2.4.0-627bea?style=for-the-badge&logo=semver&logoColor=white)](.)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.17-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-MIT-00D4FF?style=for-the-badge)](LICENSE)

<br/>

> *"The future of perception — zero latency, zero compromise, zero server-side footprint."*

<br/>

</div>

---

## 👁️ What is NeuralEye?

**NeuralEye Enterprise** is a production-ready, browser-native AI vision platform. It uses **TensorFlow.js + COCO-SSD** to detect and classify objects in real time directly from your webcam feed — entirely on the client side. No cloud. No server. No data leaves your device.

Built for speed, security, and scale.

```
📸 Live Webcam  ──►  🧠 TensorFlow.js (COCO-SSD)  ──►  📊 Analytics Dashboard  ──►  📄 PDF Report
       ↑                       ↑                                ↑                          ↑
  react-webcam            WebGL2 Backend              Recharts + React              jsPDF + html2canvas
```

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Real-Time Detection** | Sub-10ms inference using WebGL2 GPU acceleration |
| 🔒 **100% Local Processing** | Zero server-side image storage — all data stays in the browser |
| 📊 **Analytics Dashboard** | Live KPIs, detection traffic charts, and object class distribution |
| 📄 **PDF Report Export** | One-click session report generation with jsPDF |
| 📋 **Detection Log** | Live scrollable log of every detected object with timestamps |
| 🎨 **Premium UI** | Dark-mode enterprise interface with animated Neural Eye logo |
| 📱 **Fully Responsive** | Optimized for both desktop and mobile viewports |

---

## 🗂️ Project Structure

```
neuraleye-enterprise/
├── 📄 index.html                  # Entry point + Tailwind config + custom CSS
├── 📄 index.tsx                   # React root renderer
├── 📄 App.tsx                     # View router (LANDING → DASHBOARD → ANALYTICS → PDF)
├── 📄 types.ts                    # TypeScript interfaces & enums
│
├── components/
│   ├── 🎯 ObjectDetector.tsx      # Webcam + TF.js inference loop + canvas overlay
│   ├── 🖥️  Dashboard.tsx           # Main detection view with live feed
│   ├── 📊 AnalyticsDashboard.tsx  # Charts, KPIs, class breakdown
│   ├── 📋 DetectionLogList.tsx    # Real-time scrollable detection log
│   ├── 📄 PDFReport.tsx           # Report generation view
│   └── 🏠 LandingPage.tsx         # Marketing landing with animated logo
│
├── 📦 package.json
├── ⚙️  vite.config.ts
└── 🔧 tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- A modern browser with **WebGL2** support (Chrome / Edge / Firefox)
- A working **webcam**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/neuraleye-enterprise.git
cd neuraleye-enterprise

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **`http://localhost:3000`** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (CLIENT)                         │
│                                                                 │
│  ┌──────────────┐    ┌───────────────────┐    ┌─────────────┐  │
│  │  react-webcam │───►│  COCO-SSD Model   │───►│  Canvas API │  │
│  │  (video feed) │    │  (TensorFlow.js)  │    │  (bbox draw)│  │
│  └──────────────┘    └───────────────────┘    └─────────────┘  │
│           │                   │                                 │
│           ▼                   ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              App State (React useState)                  │   │
│  │         logs[], fps, detections[], threshold             │   │
│  └─────────────────────────────────────────────────────────┘   │
│           │                   │                                 │
│           ▼                   ▼                                 │
│  ┌──────────────┐    ┌───────────────────┐                     │
│  │ Detection Log │    │ Analytics + PDF   │                     │
│  └──────────────┘    └───────────────────┘                     │
│                                                                 │
│  ⚠️  NOTHING leaves this box. Zero server calls.               │
└─────────────────────────────────────────────────────────────────┘
```

### Detection Model

NeuralEye uses **COCO-SSD** (`lite_mobilenet_v2` base) — a fast, lightweight object detection model capable of identifying **80 object classes** including:

`person` • `car` • `bicycle` • `laptop` • `phone` • `chair` • `bottle` • `dog` • `cat` • and 71 more...

---

## 📱 App Views

```
[ Landing Page ]
      │
      ▼  (Launch App)
[ Dashboard ]  ←──── live webcam + detection overlay + log sidebar
      │
      ▼  (Stop Session)
[ Analytics Dashboard ]  ←──── KPI cards + area chart + class breakdown
      │
      ▼  (Generate Report)
[ PDF Report ]  ←──── exportable session summary
```

---

## ⚙️ Configuration

| Parameter | Default | Description |
|---|---|---|
| `threshold` | `0.5` | Minimum confidence score to display a detection |
| `modelType` | `coco-ssd` | Detection model (currently COCO-SSD) |
| `maxLogs` | `1000` | Max log entries kept in memory for analytics |
| `camera` | `environment` | Preferred camera (`environment` = rear, `user` = front) |

---

## 🛠️ Tech Stack

```
Frontend Framework  →  React 19 + TypeScript 5.8
Build Tool          →  Vite 6.2
Styling             →  Tailwind CSS + Custom CSS
AI / ML             →  TensorFlow.js 4.17 + COCO-SSD 2.2.3
Camera              →  react-webcam 7.2
Charts              →  Recharts 3.7
PDF Export          →  jsPDF 2.5 + html2canvas 1.4
```

---

## 🔐 Privacy

> **NeuralEye processes everything locally.**

- ❌ No video data is ever transmitted to a server
- ❌ No images are stored anywhere
- ✅ All inference happens inside the browser tab using WebGL
- ✅ Closing the tab = all session data is gone

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<br/>

**Built with precision. Designed with intent.**

<br/>

![](https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=flat-square&logo=typescript)
![](https://img.shields.io/badge/Powered%20by-TensorFlow.js-FF6F00?style=flat-square&logo=tensorflow)
![](https://img.shields.io/badge/Zero-Cloud%20Dependency-00D4FF?style=flat-square)

<br/>

*System architecture, UI/UX direction & AI integration pipeline by* **@your-username**
<br/>
*— I am a prompt engineer*

<br/>

</div>
