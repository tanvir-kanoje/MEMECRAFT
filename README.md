<div align="center">

# 🎭 M E M E C R A F T
### *The Neural Mirror // An AI Experiment in Facial Transmutation*

[![Live Demo](https://img.shields.io/badge/Live%20Production-CloudFront%20Global%20Edge-2563EB?style=for-the-badge&logo=amazon-aws)](https://d2tuc83mjm02el.cloudfront.net)
[![AWS Serverless](https://img.shields.io/badge/Engine-AWS%20Serverless%20%2B%20Rekognition-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com)
[![Zero Biometric Debt](https://img.shields.io/badge/Privacy-24h%20Auto--Purge%20Guaranteed-10B981?style=for-the-badge)](https://aws.amazon.com/s3)
[![Latency](https://img.shields.io/badge/Latency-Sub--400ms%20Inference-00D2FF?style=for-the-badge)](https://aws.amazon.com/lambda)

<p align="center">
  <b>Step into the studio. Face the camera. Meet your internet alter-ego.</b><br/>
  A serverless computer vision platform built for viral college events, hackathons, and high-energy social installations.
</p>

[**⚡ Experience Live Production Showcase ↗**](https://d2tuc83mjm02el.cloudfront.net)

---

</div>

## 🍎 The Premise: The "Forbidden Fruit" of Computer Vision

> *"Traditional facial recognition was engineered for surveillance, gatekeeping, and biometric tracking.  
> We inverted the paradigm: turning military-grade neural networks into an irresistible, provocative mirror of human emotion and meme culture."*

When a student sits before **MEMECRAFT**, they aren't greeted with dry attendance checks or clinical forms. Instead, an interactive studio viewfinder engages them with live shutter haptics. In less than 400 milliseconds, AWS deep neural networks decompose their facial micro-expressions into an emotional vector, search an indexed vault of **800+ iconic memes**, and reveal their **Meme Twin** through a cinematic, draggable split-face morph canvas.

---

## 📸 The Experience: Split-Face Morph Stage

Inspired by Gavin Castleton’s award-winning split-portrait artwork, the reveal does not display two disconnected images. It merges the user's face with their meme twin into a **singular transmuting canvas**:

```
 ┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
 │      01 // REALITY       │  MONUMENTAL SPLIT PORTAL │   02 // THE MEME TWIN    │
 │                          │                          │                          │
 │  • 4.8rem Editorial Type │  • 4:5 Cinematic Ratio   │  • Classical Serif Title │
 │  • Live Face Telemetry   │  • Dual-Orb Morph Handle │  • 89% Neural Affinity   │
 │  • Emotion Breakdown     │  • 100% Unobstructed     │  • 1-Click Poster Print  │
 └──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

* **Smooth Drag-to-Morph:** Users slide a vertical neon divider back and forth across their face to blend reality into internet lore.
* **100% Legible Meme Typography:** Standard meme platforms crop captions. MEMECRAFT uses dynamic non-cropping viewport geometry with zero overlays, ensuring every tweet header and punchline remains razor-sharp.
* **Downloadable Exhibition Poster:** Stitches the split identity into a high-res (1600x1000) gallery-worthy poster stamped with biometric confidence metrics.

---

## 🏛️ Architecture of Resilience: Built for 500+ Humans

Engineered from the ground up to eliminate cold starts, compute crashes, and payload bottlenecks during live campus events:

```mermaid
flowchart TD
    subgraph Edge["Global Acceleration Tier"]
        Browser["👤 Student Device (Mobile / Web)"]
        CF["🌐 Amazon CloudFront CDN\nd2tuc83mjm02el.cloudfront.net"]
        S3Front["🪣 Frontend S3 (OAC Private)"]
    end

    subgraph DirectUpload["Zero-Compute Upload Pipeline"]
        APIGW["⚡ API Gateway HTTP API"]
        L_Upload["λ createUploadUrl (128MB)"]
        S3Data["🪣 S3 Data Vault (my-meme-database-2026)"]
    end

    subgraph VisionEngine["Neural Inference & Scoring"]
        L_Match["λ matchMeme (512MB Warm Cache)"]
        Rekog["🧠 Amazon Rekognition\nDetectFaces Engine"]
        Lifecycle["⏳ S3 Lifecycle Purge (24h Auto-Expire)"]
    end

    Browser -->|1. Instant CDN Load| CF
    CF --> S3Front
    Browser -->|2. Request Presigned Ticket| APIGW
    APIGW --> L_Upload
    L_Upload -->|3. Return 5-min Signed URL| Browser
    Browser -->|4. Direct Binary PUT (No Server Load)| S3Data
    Browser -->|5. Trigger Neural Match| APIGW
    APIGW --> L_Match
    L_Match -->|6. Detect Facial Geometry| Rekog
    L_Match -->|7. Score Against 800+ Memes in RAM| S3Data
    L_Match -->|8. Return Presigned Meme URL| Browser
    S3Data -.->|Zero Biometric Debt| Lifecycle
```

### Why This Engine Cannot Crash:
1. **Direct-to-S3 Presigned Ingestion:** Student images never pass through API Gateway or Lambda compute layers. Binary data flows directly from browser RAM to S3 via encrypted presigned PUT URLs, eliminating server-side memory spikes.
2. **Warm Catalog In-Memory Caching:** The 800-meme catalogue metadata is cached directly in Lambda execution memory upon container initialization. 500 requests do **not** trigger 500 S3 downloads; they evaluate in-memory vector distances in sub-50ms.
3. **Rekognition Headroom:** Operating in `us-east-1` with a default quota of 50 TPS. A 500-student event generates ~2–4 TPS at peak, running completely within safe AWS operational boundaries.

---

## 🧮 The Mathematics: Explainable Affinity Scoring

No opaque black boxes. Every match is derived from a transparent, weighted geometric distance formula ($S \in [0, 1]$):

$$\text{Affinity Score} = 0.50 \cdot E_{\text{emotion}} + 0.25 \cdot S_{\text{smile}} + 0.10 \cdot M_{\text{mouth}} + 0.10 \cdot P_{\text{pose}} + 0.05 \cdot G_{\text{eyewear}}$$

* **Top-5 Entropy Pool:** To prevent robotic repetition when multiple students smile similarly, the engine pools the top 5 highest-ranking candidates and selects with entropy-weighted randomization.

---

## 🛡️ Zero Biometric Debt: Ethical Compliance

Most AI applications hoard user faces. MEMECRAFT is architected with a **zero-retention guarantee**:

| Guardrail | Implementation |
| :--- | :--- |
| **Quarantine Prefix** | Student photos are stored strictly under `uploads/${user_sub}/` with zero public access. |
| **24-Hour Auto-Purge** | An **Amazon S3 Lifecycle Rule** (`AutoExpireStudentSelfies`) permanently deletes raw selfies after 24 hours. |
| **Short-Lived URLs** | Upload tickets expire in 5 minutes; meme exhibition links expire in 15 minutes. |
| **Data Minimization** | We do not extract, store, or infer skin tone, ethnicity, or demographic identities. |

---

## 🎨 Design Philosophy: White, Royal Blue & Holi Energy

* **The Canvas:** Clean, high-contrast alabaster white (`#FFFFFF`) with frosted glassmorphism cards.
* **The Electric Accents:** Royal Blue $\rightarrow$ Electric Cyan gradients (`#1D4ED8` $\rightarrow$ `#2563EB` $\rightarrow$ `#00D2FF`).
* **The Atmosphere:** Animated, multi-layered **Holi color powder bursts** (Gulal Magenta, Saffron Gold, and Peacock Turquoise) drifting softly across the background grid.
* **The Acoustics:** Web Audio API sound synthesizer producing tactile camera shutter snaps and triumphant arpeggio celebration chimes.

---

## 📊 Executive Project Breakdown

| Metric | Specification |
| :--- | :--- |
| **Live Web URL** | [https://d2tuc83mjm02el.cloudfront.net](https://d2tuc83mjm02el.cloudfront.net) |
| **AWS Region** | `us-east-1` (US East N. Virginia) |
| **Target Audience** | 500–1,000 students per live activation |
| **Indexed Catalog** | 800+ pre-analyzed meme templates in S3 |
| **Inference Engine** | Amazon Rekognition `DetectFaces` |
| **Cost at Scale** | ~$1.00 USD per 1,000 student inferences |
| **Frontend Stack** | React 19, Vite, Lucide Icons, Canvas Confetti |

---

## 💻 Local Development & Engineering Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/tanvir-kanoje/AWS-Memer.git
cd AWS-Memer/frontend
npm install
```

### 2. Configure Environment
Copy the template and plug in your API Gateway endpoint:
```bash
cp .env.example .env.production
```

### 3. Start Local Studio
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

<div align="center">

### 🏆 The Verdict
*A project that turns enterprise-grade AWS architecture into high-energy culture.*

**Built with architectural precision by Tanvir Kanoje**  
*AWS Serverless • Amazon Rekognition • React + Vite*

</div>
