# SmartThink

Enterprise-grade placement platform built with Spring Boot, React, and PostgreSQL. SmartThink brings together HR Mock Interviews, Aptitude Prep, Code Execution, and Advanced Analytics into a single, high-performance platform.

## Key Features
- **Smart Profile Dashboard:** Real-time data aggregation, badges, and progress tracking.
- **HR Mock Interviews:** Automated audio/text evaluations for WPM, filler words, and sentiment.
- **Coding Practice:** Remote code execution environment with test-case evaluations and streaks.
- **Aptitude Hub:** Categorized assessments across Quantitative, Logical, and Verbal domains.
- **Admin Hub:** Comprehensive dashboards with charts, user moderation, analytics, and CSV exports.

---

## 🚀 Live Demo Credentials

For demonstration and interview review purposes, the following pre-configured accounts are available with full platform analytics, progress states, and customized profiles.

### **Candidate View (Pre-populated Profile)**
- **Email:** `anu@example.com`
- **Password:** `anu@123`
*(This account has an active streak, 12 solved coding problems, completed aptitude modules, and a 100% completed modern profile dashboard).*

### **Admin View (Management Dashboard)**
- **Email:** `admin@smartthink.com`
- **Password:** `admin123`
*(Provides access to user analytics, platform settings, question banks, and moderation logs).*

---

## Technical Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Hibernate / JPA
- **Database:** PostgreSQL
- **Frontend:** React, TailwindCSS, Lucide Icons, Recharts, Axios
- **APIs:** Judge0 (Code Execution)

## Deployment Details
Both the Backend and Frontend are configured for deployment on **Render**. Environment variables control database connections, enabling seamless transitions from local development to cloud hosting.
