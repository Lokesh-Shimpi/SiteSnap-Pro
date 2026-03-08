# ⚡ SiteSnap Pro

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Puppeteer](https://img.shields.io/badge/puppeteer-%2340B5A4.svg?style=for-the-badge&logo=puppeteer&logoColor=white)

**SiteSnap Pro** is an advanced digital reliability and uptime monitoring dashboard built for modern engineering teams. Going far beyond simple `200 OK` pings, it integrates a sophisticated **Visual Regression Engine** (powered by Puppeteer) alongside real-time global latency tracking. This empowers DevOps, QA, and SRE teams to not just know *if* a site is up, but verify that it *looks right* and performs optimally across different geographic regions, preventing silent UI failures before they impact end-users.

---

## 🎥 Live Demo & Preview

[SiteSnap Pro Demo Video]((https://youtu.be/vWeHj8ZigSg?si=jOwTfWQPkjoqgXUK))

---

## 🛠️ Tech Stack

- **Frontend:** React.js, TailwindCSS, Vite (Deployed on Vercel)
- **Backend:** Node.js, Express.js (Deployed on Render)
- **Database:** MongoDB Atlas
- **Core Engine:** Puppeteer (Headless Chromium), Node-Cron for scheduled jobs
- **Security:** JWT Authentication, Nodemailer for OTP email verification

---

## 🚀 Core Features

- **🔐 Secure OTP Authentication**  
  Robust, passwordless registration and login via email-based OTPs, ensuring verified and secure user access.
  
- **👁️ Visual Regression Analysis**  
  Automatically captures and compares Baseline vs. Current DOM renders using Headless Chromium, proactively alerting teams to unintended UI mutations.
  
- **⏱️ Graceful Degradation Latency Tracking**  
  Monitors application responsiveness globally, providing deep insights into network latency and performance degradation under load.
  
- **📊 Unified Interactive Dashboard**  
  A highly interactive, sleek, and developer-friendly control panel to manage monitors, view analytics, and track reliability metrics in real-time.

---

## 🎯 The Problem It Solves (Why SiteSnap Pro?)

Traditional uptime monitoring tools rely on simple HTTP pings, returning a `200 OK` status when the server responds. However, in modern Single Page Applications (SPAs) and complex frontends, a server can return a `200 OK` while the user stares at a blank screen due to a JavaScript runtime error or a broken CSS deployment. 

**SiteSnap Pro was developed to bridge this critical observability gap.** 

It goes beyond basic uptime by answering three essential questions for any deployment:
1. **Is the server reachable?** (Uptime Ping)
2. **Does the UI look correct?** (Visual Regression Engine)
3. **Is it fast globally?** (Regional Latency Tracking)

By automatically taking snapshots of your application using a real headless browser and comparing them against a known baseline, SiteSnap Pro catches "silent UI failures" (e.g., missing buttons, unrendered components, broken layouts) *before* they impact your end-users.

---

## 💻 Local Setup & Installation

Follow these steps to get a copy of SiteSnap Pro running locally on your machine.

```bash
# Clone the repository
git clone https://github.com/your-username/sitesnap-pro.git
cd sitesnap-pro

# 1. Install dependencies for the backend (Server)
cd server
npm install

# 2. Install dependencies for the frontend (Client)
cd ../client
npm install

# 3. Start the Server (from the /server directory)
npm run dev

# 4. Start the Client (from the /client directory in a new terminal)
npm run dev
```

---

## 🔐 Environment Variables

Create a clean `.env` file in the root of your `server` directory and add the following required keys:

| Variable       | Description                                      | Example Value                         |
|----------------|--------------------------------------------------|---------------------------------------|
| `PORT`         | Port on which your server will run               | `5000`                                |
| `MONGO_URI`    | Your MongoDB Atlas connection string             | `mongodb+srv://...`                   |
| `JWT_SECRET`   | A secure secret key for JSON Web Tokens          | `super_secret_key_123`                |
| `EMAIL_USER`   | Email address for Nodemailer OTP delivery        | `alert@sitesnap.pro`                  |
| `EMAIL_PASS`   | App password or SMTP password for the email      | `your_app_password`                   |
| `FRONTEND_URL` | URL of the frontend for CORS and redirects       | `http://localhost:5173`               |

---

## 👨‍💻 Author

**Lokesh Shimpi**


