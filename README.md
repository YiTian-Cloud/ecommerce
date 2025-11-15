# E-Commerce Demo

A simple full-stack e-commerce demo built with Angular, Node.js, and MongoDB.

##  Try It

| Description | URL |
|------------|-----|
| Live Frontend | https://ecommerce-azure-ten-88.vercel.app |

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular (Standalone Components) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

ecommerce/
├── ecart-frontend/ # Angular app (Vercel)
└── ecart-backend/ # Node.js API (Render)
## ▶️ Run Locally

Backend:

```bash
cd ecart-backend
npm install
npm run dev
Frontend:

bash
Copy code
cd ecart-frontend
npm install
npm run start
Then open:
http://localhost:4200

Frontend config (dev):

ts
Copy code
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000'
};
