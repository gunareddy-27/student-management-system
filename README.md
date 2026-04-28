# 🧠 SmarterCampus AI Command Center (Prototype)

> **Status**: Final Year Project Proposal / Prototype
> **Version**: 1.0.0
> **Evaluator Ready**: Yes

---

## 1. 📖 Problem Statement
Existing Campus Management Systems (CMS) are primarily **static databases** that require manual data entry and provide no proactive assistance to students. Key pain points include:
*   **System Fragmentation**: Students must navigate separate portals for fees, attendance, library, and career services.
*   **Cognitive Overload**: Lack of intelligent prioritization leads to missed deadlines and academic burnout.
*   **Reactive Nature**: Systems only record data (e.g., poor grades) rather than providing proactive interventions (e.g., study roadmaps).

**SmarterCampus** solves this by integrating a **Multi-Agent AI Ecosystem** that acts as a proactive personal assistant for every student.

---

## 2. 🏗️ System Architecture
The platform follows a **Modular Micro-frontend Architecture** integrated with a centralized **Autonomous Orchestration Layer**.

```mermaid
graph TD
    User((Student)) -->|React Dashboard| Frontend[Frontend: React + Framer Motion]
    Frontend -->|REST + WebSockets| Gateway[API Gateway / Spring Boot]
    
    subgraph AI_Engine [Intelligence Layer]
        AgentHub[Neural Orchestrator]
        StudyAI[Study Architect - NLP/LLM]
        RiskAI[Predictive Risk Analytics]
        FinanceAI[Wallet Transaction Engine]
    end
    
    Gateway --> AI_Engine
    Gateway --> DB[(MySQL / Database)]
    
    DB <--> AI_Engine
```

---

## 2.1 🔄 Operational Data Flow
This diagram illustrates how the system processes a typical student interaction (e.g., ordering from the Canteen).

```mermaid
sequenceDiagram
    participant S as Student (React)
    participant B as Backend (Spring Boot)
    participant W as WebSocket (SockJS)
    participant D as Database (MySQL)

    S->>B: 1. POST /api/wallet/pay (Order Request)
    B->>D: 2. Query Wallet Balance
    D-->>B: Current Balance: ₹450
    B->>D: 3. Deduct ₹110 & Log Transaction
    B-->>S: 4. HTTP 200: Payment Successful
    
    Note over B,W: Broadcast triggered
    B->>W: 5. STOMP Broadcast: 'CAMPUS_PULSE'
    W-->>S: 6. Push Notification to all active users
    
    S->>B: 7. GET /api/students/profile (Update UI)
    B-->>S: Return updated attendance/balance data
```

---

## 3. 🤖 AI/ML Implementation Strategy
To ensure feasibility within a prototype scope, the following models and algorithms are utilized (simulated in frontend for demo, architected for backend):

| Agent | AI/ML Model | Primary Input | Intended Output |
| :--- | :--- | :--- | :--- |
| **Study Architect** | NLP (Transformer-based) | Course Material / Queries | Simplified Concept Explanations |
| **Risk Analytics** | Predictive Scoring | Attendance & Grades | At-Risk Student Flagging |
| **Wallet Engine** | Secure Ledger | Transactions | Real-time Balance & Canteen Pay |
| **Sentinel AI** | Sentiment Analysis (VADER) | Mood Check-ins | Wellness Intervention Triggers |
| **Smart Canteen** | Queue Optimization | Order Logs | Live Wait-Time Predictions |

---

## 4. 🗄️ Database Schema Design
The system utilizes a relational schema to maintain high data integrity across agents.

```mermaid
erDiagram
    STUDENT ||--o{ ATTENDANCE : tracks
    STUDENT ||--o{ AI_INSIGHTS : generates
    STUDENT ||--o{ AUTOMATION_LOGS : triggers
    STUDENT {
        int id PK
        string name
        string roll_no
        string skill_matrix
    }
    AI_INSIGHTS {
        int id PK
        int student_id FK
        string agent_type
        string insight_data
        timestamp created_at
    }
    AUTOMATION_LOGS {
        int id PK
        string action_name
        string impact_score
        timestamp executed_at
    }
```

---

## 5. ⚙️ Functional Modules & Implementation Status

### 🟢 Fully Implemented (Prototype Ready)
*   **Spring Boot Backend**: Robust Java-based API with JWT Security.
*   **Campus Pulse (WebSockets)**: Real-time global notifications and SOS alerts.
*   **Smart Wallet & Canteen**: Digital financial layer for seamless campus payments.
*   **Predictive Analytics**: AI-driven student risk identification.
*   **AI Pavilion Dashboard**: Centralized hub for agent management.
*   **Digital ID Hub**: Scannable QR-based attendance system.
*   **Skill Master AI**: 12-week roadmap generator.

### 🟡 Partially Implemented / Simulated
*   **Mood Intelligence**: Sentiment-based check-in UI (ML Model simulated).
*   **Resume Export**: Automated data aggregation for CV generation.
*   **Neural Concept Explainer**: LLM-integrated prompt simulator.

---

## 📊 6. Expected Outcomes & Validation
The "18.5 hours saved" claim is based on a **theoretical efficiency model** (Prototype Validation Phase):
1.  **Schedule Healing**: Reduces manual calendar management by ~4 hrs/week.
2.  **Resource Discovery**: Grant/Research scouting reduces search time by ~8 hrs/week.
3.  **Concept Mastery**: AI-driven summaries reduce initial study time by ~6.5 hrs/week.

---

## 🛠️ 7. Technical Stack
*   **Frontend**: React (Hooks, Context API), Framer Motion (Animations), Lucide Icons, STOMP/SockJS.
*   **Backend**: Spring Boot 3.2.4 (Java 21), Spring Security, Hibernate (JPA).
*   **Database**: MySQL (Relational Schema).
*   **Architecture**: WebSocket (Real-time), JWT (Auth), REST (Data).
*   **Design**: Glassmorphism / Neural Elegance Design System.

---

## 🏁 8. Final Project Scope
This project serves as a **High-Fidelity Proof of Concept (PoC)** demonstrating how a Multi-Agent AI system can revolutionize campus productivity. While LLM calls are simulated for the prototype, the architecture is built to support live API integration (OpenAI/HuggingFace).

---
*Developed for Academic Defense - SmarterCampus Team*
