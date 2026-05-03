# Electro-Guide AI 🗳️

An intelligent, full-stack citizen engagement platform designed to simplify the voting journey and combat election misinformation.

## 🚀 The Solution

Electro-Guide AI acts as a digital companion for voters, providing real-time guidance, candidate transparency, and fact-checking services.

### 🌟 Chosen Vertical
**Civic Technology & Citizen Engagement**: Leveraging AI to bridge the information gap between the Election Commission and the common citizen.

---

## 🛠️ Approach & Logic

### 1. Architecture
- **Frontend**: React (Vite) with a premium, responsive dark-mode UI.
- **Backend**: Node.js & Express for secure API handling.
- **Database**: Prisma ORM with SQLite/PostgreSQL compatibility.
- **Cloud Infrastructure**: **Google Cloud Platform (GCP)** integration:
    - **Google Cloud Vision API**: For intelligent Voter ID verification and OCR.
    - **Google Places API**: For localized polling booth discovery.
    - **Google Maps API**: For interactive geographic services.
- **State Management**: Zustand for seamless user context.

### 2. Intelligent Intent Engine & GCP Services
The core logic resides in a backend-driven intent processor that analyzes user queries and leverages Google Cloud services:
- `REGISTRATION_INTENT`: Guiding users through voter ID processes with **Vision API** validation.
- `MISINFORMATION_CHECK`: Verifying claims using a verified fact database.
- `SIMULATION_REQUEST`: Launching interactive voting walkthroughs.
- `LOCATION_SERVICE`: Finding nearby polling booths via **Google Places** integration.

### 3. Dynamic User Personalization
Users can set their residential state, which dynamically updates:
- **Election Dates**: Synchronized with the 2024 General Election schedule.
- **Candidate Data**: Filtered based on the user's location.
- **Geo-Services**: State-specific polling booth mapping.

---

## 🧠 Assumptions Made

1.  **2024 Election Cycle**: Data (dates and candidates) is based on the 18th Lok Sabha General Election schedule as a primary reference.
2.  **Anonymous Onboarding**: For a seamless demo experience, the system automatically registers an anonymous profile if no token is present, ensuring instant access to AI features.
3.  **Mock Candidates**: Since real-time constituency-level data is highly localized, a curated set of mock candidates is provided for demonstration states (Maharashtra, Kerala, Bihar, etc.).
4.  **Simulated Reminders**: The calendar reminder system uses a mock API response to simulate Google Calendar integration without requiring OAuth setup for the initial demo.

---

## 📦 Local Setup

1.  **Install Dependencies**: `npm install`
2.  **Database Sync**: `npx prisma db push && npx prisma db seed`
3.  **Start Dev Server**: `npm run dev:all`
4.  **Access App**: `http://localhost:5173`

---

**Developed for a transparent and informed democracy.**
