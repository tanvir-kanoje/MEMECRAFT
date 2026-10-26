# ✦ MEMECRAFT // AWS-Powered Image-to-Meme Matching Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CloudFront%20CDN-2563EB?style=for-the-badge&logo=amazon-aws)](https://d2tuc83mjm02el.cloudfront.net)
[![AWS Serverless](https://img.shields.io/badge/Architecture-AWS%20Serverless-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com)
[![React 19](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-00D2FF?style=for-the-badge&logo=react)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

> **Live Production URL:** [https://d2tuc83mjm02el.cloudfront.net](https://d2tuc83mjm02el.cloudfront.net)  
> **API Gateway Invoke Endpoint:** `https://qjuuckqrxj.execute-api.us-east-1.amazonaws.com`

---

## 🎭 Overview

**MEMECRAFT** is a serverless AI web platform built for college festivals, hackathons, and social events. A student captures or uploads a selfie, and within seconds, our serverless pipeline analyzes their facial micro-expressions using **Amazon Rekognition** and pairs them with an expressional counterpart chosen from an indexed catalogue of **800+ memes**.

The match is presented as an interactive **Split-Face Alter-Ego Morph Stage** (inspired by Gavin Castleton's album artwork), allowing users to slide between reality and their meme twin, and export high-resolution posters.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Student Browser (HTTPS)"]
        UI[React + Vite Web App]
        Viewfinder[Webcam / Upload]
        Slider[Interactive Split-Face Morph Stage]
    end

    subgraph Edge["Global CDN"]
        CF[Amazon CloudFront\nd2tuc83mjm02el.cloudfront.net]
        S3Front[S3 Frontend Bucket\nOAC Secure Private Access]
    end

    subgraph API["Backend API Layer"]
        APIGW[API Gateway HTTP API\n/uploads/presign & /matches]
        L1[Lambda: createUploadUrl\nGenerates 5-min Presigned PUT]
        L2[Lambda: matchMeme\nScores 800+ Memes in Memory]
    end

    subgraph Storage["Storage & Vision AI"]
        S3Data[S3 Bucket: my-meme-database-2026\n• images/ (Catalog)\n• metadata/memes_metadata.json\n• uploads/ (Selfies)]
        Rekog[Amazon Rekognition\nDetectFaces API]
        LifeCycle[S3 Lifecycle Rule\nAuto-Delete Selfies in 24h]
    end

    UI -->|1. Load Website| CF
    CF --> S3Front
    UI -->|2. Request Upload Ticket| APIGW
    APIGW --> L1
    L1 -->|3. Return Presigned URL| UI
    UI -->|4. Direct PUT Upload| S3Data
    UI -->|5. Request Match| APIGW
    APIGW --> L2
    L2 -->|6. Detect Faces| Rekog
    L2 -->|7. Load & Score Metadata| S3Data
    L2 -->|8. Return Top Match URL| UI
    UI -->|9. Interactive Morph & Export| Slider
    S3Data -.->|Purge 24h| LifeCycle
```

---

## ⚡ Key Highlights & Engineering Achievements

* **Decoupled Serverless Processing:** Precomputed catalog analysis is separated from live inference. 800+ memes are indexed once into an S3 vector metadata structure, keeping live user match latency under **400ms**.
* **Zero-Compute Bottlenecks:** Student photos upload directly from the browser to private S3 storage via short-lived presigned `PUT` URLs. Heavy binary image payloads never touch API Gateway or Lambda compute memory.
* **Warm In-Memory Cache:** The matching Lambda loads `memes_metadata.json` once into execution memory, avoiding redundant S3 reads and scaling effortlessly for **500+ concurrent users**.
* **Privacy-First (Zero Biometric Retention):** Student uploads are isolated under `uploads/{user_sub}/` and automatically purged after **24 hours** via an Amazon S3 Lifecycle rule.
* **100% Unobstructed Meme Visibility:** Images utilize `object-fit: contain` with zero floating badges or dark vignette overlays, ensuring every tweet header and punchline caption remains completely legible.

---

## 🎨 Visual Identity & Art Direction

* **White Alabaster Canvas:** Clean, luminous backdrop (`#FFFFFF` & `#F8FAFC`) with frosted glass surface cards (`backdrop-filter: blur(24px)`).
* **Electric Blue & Cyan Gradients:** Vibrant branding accents (`#1D4ED8` $\rightarrow$ `#2563EB` $\rightarrow$ `#00D2FF`).
* **Festive Holi Color Powder Bursts:** Animated, softly diffused floating Gulal clouds in Pink/Magenta (`#FF007F`), Saffron/Marigold (`#FF9900`), and Turquoise Cyan (`#00D2FF`) drifting across the background.
* **Non-Overlapping 3-Column Grid:** Balanced layout separating **`01 // REALITY`** telemetry, the **Split-Face Centerpiece**, and **`02 // THE MEME TWIN`** affinity metrics.
* **Web Audio API Sound Engine:** In-browser synthesized camera shutter snaps and celebratory arpeggio chimes with zero external audio assets.

---

## 🧮 Explainable Match Algorithm

Rather than relying on opaque black-box recommendations, the platform evaluates an explainable multi-attribute affinity score ($S \in [0, 1]$):

$$\text{Score} = (0.50 \times \text{Emotion}) + (0.25 \times \text{Smile}) + (0.10 \times \text{MouthOpen}) + (0.10 \times \text{PoseSimilarity}) + (0.05 \times \text{Eyewear})$$

To guarantee freshness, the algorithm pools the **top 5 highest-ranking candidates** and applies randomized selection to prevent repetitive results for identical expressions.

---

## 📂 Repository Structure

```
AWS - Meme Project/
├── README.md                                          # Complete Project Documentation
├── backend/
│   ├── create_upload_url/
│   │   └── lambda_function.py                         # Lambda: S3 Presigned PUT Ticket Generator
│   └── match_meme/
│       └── lambda_function.py                         # Lambda: Rekognition Inference & Weighted Matcher
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js                              # Direct S3 + API Gateway Integration
│   │   ├── components/
│   │   │   ├── CameraBooth.jsx                        # Live Viewfinder, Snap Shutter & Demo Presets
│   │   │   ├── SplitFaceSlider.jsx                    # 3-Column Split-Face Morph Stage
│   │   │   ├── AnalyzingOverlay.jsx                   # Holographic Laser Face Scan
│   │   │   ├── Header.jsx                             # Live Telemetry & Vibe Status
│   │   │   └── SettingsModal.jsx                      # Live API Endpoint Configuration
│   │   ├── utils/
│   │   │   ├── audio.js                               # Web Audio API Synthesizer
│   │   │   └── exportCard.js                          # Canvas Split-Face Poster PNG Exporter
│   │   ├── App.jsx                                    # Main Application Component
│   │   ├── App.css                                    # 3-Column Grid & Stage Layouts
│   │   └── index.css                                  # White, Blue & Holi Design System Tokens
│   ├── .env.production                                # Production API Gateway Endpoint
│   ├── index.html                                     # HTML5 Entrypoint & Google Fonts
│   └── package.json                                   # Dependencies (Vite, React, Lucide, Confetti)
└── AWS_Image_to_Meme_Project_Starter_Pack/
    └── preprocess_memes.py                            # One-time Dataset Indexer using boto3
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
* Node.js v20+ & npm
* Python 3.11+ (for backend development)

### 2. Run the Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
cd frontend
npm run build
```
Compiled assets will be placed in `frontend/dist/`.

---

## ☁️ AWS Cloud Deployment Guide

### Phase 1: Deploy Backend Lambdas
1. In the AWS Console (`us-east-1`), create:
   * **`createUploadUrl`** (Runtime: Python 3.12, Memory: 128 MB, Timeout: 10s) with code from [`backend/create_upload_url/lambda_function.py`](backend/create_upload_url/lambda_function.py).
   * **`matchMeme`** (Runtime: Python 3.12, Memory: 512 MB, Timeout: 30s) with code from [`backend/match_meme/lambda_function.py`](backend/match_meme/lambda_function.py).
2. Attach IAM permissions: `AmazonS3FullAccess` and `AmazonRekognitionReadOnlyAccess`.

### Phase 2: Configure API Gateway
1. Create an **HTTP API** named `meme-matcher-api`.
2. Map routes:
   * `POST /uploads/presign` $\rightarrow$ `createUploadUrl`
   * `POST /matches` $\rightarrow$ `matchMeme`
3. Configure CORS with `https://d2tuc83mjm02el.cloudfront.net` and `http://localhost:5173`.

### Phase 3: S3 & CloudFront CDN
1. Upload contents of `frontend/dist/` to your frontend S3 bucket (`college-meme-craft-frontend-2026`).
2. Create an Amazon CloudFront distribution pointing to the bucket using **Origin Access Control (OAC)**.
3. Attach the generated CloudFront read policy to the S3 bucket.
4. Set default root object to `index.html`.

---

## 🔒 Security, Compliance & Cost Guardrails

* **Zero Public Bucket Access:** All S3 buckets enforce 100% Block Public Access.
* **Short-Lived URLs:** Presigned PUT upload tickets expire in 5 minutes; meme GET links expire in 15 minutes.
* **Auto-Purge Rule:** S3 Lifecycle rule `AutoExpireStudentSelfies` permanently purges student photos after 24 hours.
* **Cost Efficiency:** At ~$0.001 per `DetectFaces` scan, 1,000 student submissions costs **~$1.00 USD**.

---

## 🎓 Presentation Pitch (Evaluators & College Hackathons)

> *"Traditional meme platforms rely on manual text tags or static search queries. Our platform harnesses AWS Rekognition's deep neural networks to decode facial geometry and micro-expressions in real time. Built with a decoupled serverless architecture, student photos upload directly to private S3 buckets without loading down application servers, effortlessly supporting over 500 simultaneous users. With an interactive Gavin Castleton-style split-face morph slider and zero permanent biometric retention, MEMECRAFT proves that cutting-edge computer vision can be both deeply engaging and architecturally responsible."*

---

**Developed with ❤️ by Tanvir Kanoje**  
*AWS Serverless • Amazon Rekognition • React + Vite*
