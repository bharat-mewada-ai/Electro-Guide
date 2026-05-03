# ElectiGuide AI - Test Scenarios & Interactions

This document outlines the core interaction flows used to validate the AI's decision-making and the application's responsiveness.

## 1. Intent Detection Accuracy

| Test Case | User Input | Expected Intent | Key Reasoning |
| :--- | :--- | :--- | :--- |
| **TC-01** | "How do I get my voter ID card?" | `REGISTRATION_INTENT` | High confidence (0.95) due to 'voter id'. |
| **TC-02** | "Is it true EVMs are fixed?" | `MISINFORMATION_CHECK` | Matches rumor patterns around 'evm'. |
| **TC-03** | "Walk me through the booth" | `SIMULATION_REQUEST` | Explicit request for 'walkthrough'. |
| **TC-04** | "Show me the map for my booth" | `LOCATION_SERVICE` | Geospatial trigger 'map'. |

## 2. Personalization Flow

1. **Step 1**: User opens **Profile** from sidebar.
2. **Step 2**: User changes Name to "Rahul" and State to "Delhi".
3. **Step 3**: User navigates back to **Home**.
4. **Step 4**: User asks "When do I vote?".
5. **Expected Outcome**: Assistant responds: "Rahul, in Delhi, the election is on May 25, 2024 (Phase 6)."

## 3. Misinformation Verification

- **Input**: "I heard we can vote via WhatsApp this time."
- **Logic Analysis**:
    - `intent`: `MISINFORMATION_CHECK`
    - `confidence`: 0.98
    - `verdict`: FALSE
    - `reasoning`: "Matched known myth patterns: [online, internet, whatsapp, mobile]."
- **UI Feedback**: Displays a red-bordered verdict card in the right panel with official ECI stance.

## 4. Booth Simulation UX

1. **Trigger**: User types "How does voting work?".
2. **AI Action**: Returns `PROCEDURAL_GUIDE` intent and suggests starting the simulation.
3. **User Action**: Clicks "Simulation Mode" button in header.
4. **Flow**: 
    - Step 1: Identity Proof verification image.
    - Step 2: Ink marking simulation.
    - Step 3: EVM button press walkthrough.
    - Step 4: VVPAT confirmation.
5. **Success Criteria**: All 4 steps completed, modal closes automatically.
