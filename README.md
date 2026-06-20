# Business Travel and Expense Claim Web Application

A modern, multi-page React web application designed to digitize and replace the legacy macro-enabled Excel sheet (`Controls-F-014-T_sk,en_Business_travel_and_expense_claim_form.xlsm`). The application streamlines the workflow for calculating business trip expenses, simulating advanced Excel macro behaviors for domestic (Slovakia) and international travel claims, auto-computing summary totals, and providing high-fidelity PDF print exports.

---

## 🛠️ Tools & Dependencies

### Frontend Framework & Core Ecosystem
* **React (v18+)** – Component-based UI structure.
* **Vite** – Next-generation frontend build tool providing fast Hot Module Replacement (HMR).
* **React Router DOM** – Governs declarative client-side routing and page-to-page navigation flow.
* **Tailwind CSS** – Utility-first CSS framework for rapid and clean responsive layouts matching Excel grid aesthetics.

### Context & State Management
* **React Context API** – Facilitates global state synchronization across separate pages (Business Trip info, dynamically generated expense sheets, and calculated Summary data).

### Build & Containerization
* **Docker** – Multi-stage build support ensuring uniform compilation, containment, and deployment.
* **NGINX** – Low-footprint web server utilized inside the production Docker stage to serve compiled static assets securely.

---

## 📂 Project Structure

```text
travel-expense-app/
├── public/                     # Static files (icons, images, public manifests)
├── src/
│   ├── components/
│   │   ├── PreviewModal.jsx    # Pop-up modal to preview PDF-ready layouts
│   │   └── Layout.jsx          # Shared application shell containing header & nav
│   ├── pages/
│   │   ├── BusinessTrip.jsx    # Primary entry page / employee details selection
│   │   ├── SlovakiaTrip.jsx    # Domestic expense grid with "Make it" VBA simulation
│   │   ├── AbroadTrip.jsx      # International travel grid with currency conversions
│   │   └── Summary.jsx         # Total calculations and final reimbursement overview
│   ├── context/
│   │   └── AppContext.jsx      # Core global state engine syncing cross-sheet data
│   ├── utils/
│   │   └── printUtility.js     # High-fidelity native browser PDF export handler
│   ├── App.jsx                 # Route manager and entry layout binder
│   └── main.jsx                # Application initialization entrypoint
├── Dockerfile                  # Multi-stage Docker deployment script
├── nginx.conf                  # NGINX reverse-proxy routing rules for containerized SPA
├── package.json                # Project dependencies and script declarations
└── vite.config.js              # Vite compiler configurations
```

## Quick Start Guide

### Option 1: Run Locally (Development Mode)
Ensure you have Node.js installed.

1. Clone or create the project directory:

Bash
cd travel-expense-app


2. Install project dependencies:

Bash
npm install

3. Boot the Vite development server:

Bash
npm run dev


4. Open your browser and navigate to the address shown in your terminal (usually http://localhost:5173).

### Option 2: Run with Docker (Recommended for Production)
Ensure you have Docker Desktop installed and running.

1. Build the Docker image:
This command compiles the React assets via a lightweight alpine node image and moves the final bundle directly into a clean NGINX environment.

Bash
docker build -t business-trip .

or

Bash
docker build --no-cache -t business-trip .


2. Run the container:
Maps the internal NGINX container port 80 to your host computer's port 8080.

Bash
docker run -d -p 8080:80 travel-expense-app


3. Access the application:
Open your web browser and navigate to http://localhost:8080.