# SiteSnap

SiteSnap is a full-stack screenshot tool and health checker.

## Structure

- `/server`: Node.js + Express + Puppeteer backend.
- `/client`: React + Vite frontend.

## Getting Started

### Backend
1. `cd server`
2. `npm install`
3. `npm start` (Runs on port 3000)

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

## Deployment

### Backend (Render)
- Deploy as **Docker** service.
- Use the provided `Dockerfile`.
- Render will automatically build the image.

### Frontend (Vercel)
- Set Environment Variable: `VITE_API_URL` to your backend URL (e.g. `https://your-backend.onrender.com`).
