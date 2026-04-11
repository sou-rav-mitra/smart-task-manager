# Docket. — Smart Task Manager

A modern, full-stack task management app built with the MERN stack. Clean UI, real authentication, and powerful task organization features.

🔗 **Live Demo:** https://smart-task-manager-gamma-six.vercel.app

---

## Screenshots

[Dashboard screenshot]<img width="1457" height="768" alt="Docket_dashboard" src="https://github.com/user-attachments/assets/81fc9816-59bb-486b-a65a-00bdd35a05a1" />

[Sign In screenshot]<img width="1457" height="768" alt="Docket_SignIn" src="https://github.com/user-attachments/assets/e3fbfb5c-21aa-462d-8cbb-716e00af0e41" />


---

## Features

- JWT authentication — register, login, logout securely
- Create, edit, delete, and complete tasks
- Set priorities (low, medium, high) with color indicators
- Add tags to tasks and filter by tag
- Search tasks by title
- Filter tasks by priority
- Drag and drop to reorder tasks
- Deadlines with date picker
- Fully responsive — works on mobile and desktop
- Animated UI with Vanta.js and Framer Motion

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion
- Vanta.js
- Axios
- React Router v6
- @dnd-kit

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt password hashing

**Deployment**
- Frontend — Vercel
- Backend — Render
- Database — MongoDB Atlas

---

## Running Locally

**Clone the repo**
```bash
git clone https://github.com/sou-rav-mitra/docket.git
cd docket
```

**Backend setup**
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
```

```bash
npx nodemon index.js
```

**Frontend setup**
```bash
cd client
npm install
npm run dev
```

---

## What I Learned

- Building a complete REST API with Express and MongoDB
- JWT authentication flow with protected routes
- React state management with Context API
- Connecting a React frontend to a Node.js backend
- Deploying a full stack app to production

---

## Author

**Sourav Mitra**
- GitHub: [@sou-rav-mitra](https://github.com/sou-rav-mitra)
