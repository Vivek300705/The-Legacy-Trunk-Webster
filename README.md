# 🌳 StoryNest – Family Legacy Platform

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)
![Firebase](https://img.shields.io/badge/Firebase-10.x-orange.svg)

A *modern web application* for preserving and sharing family stories, building family trees, and maintaining connections across generations.

---

## ✨ Features

- 📖 *Family Story Management* – Create, edit, and share stories with your family circle  
- 👨‍👩‍👧‍👦 *Family Circles* – Organize members and manage relationships  
- 🕰️ *Timeline View* – Visualize family stories chronologically  
- 🖼️ *Media Uploads* – Attach photos, videos, and audio to stories  
- 🔍 *Search Functionality* – Find stories or family members easily  
- 🔗 *Relationship Management* – Define and track family connections  
- 🔐 *Authentication* – Secure Firebase authentication integrated with MongoDB  

---

## 🧠 Tech Stack

### *Frontend*
- ⚛️ React (with Vite)
- 🔥 Firebase Authentication
- 🌐 Axios for API calls
- 🎨 Tailwind CSS
- 🚀 Deployed on *Vercel*

### *Backend*
- 🟩 Node.js with Express
- 🍃 MongoDB with Mongoose
- 🔑 Firebase Admin SDK for token verification
- ☁️ Cloudinary for media storage
- ⚙️ Deployed on *Render*

---

## 🗂️ Project Structure


storynest/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service functions
│   │   ├── Firebase/        # Firebase configuration
│   │   └── utils/           # Utility functions
│   └── .env                 # Environment variables
│
└── backend/
    ├── src/
    │   ├── controllers/     # Route controllers
    │   ├── models/          # Mongoose models
    │   ├── routes/          # API routes
    │   └── middlewares/     # Authentication middleware
    └── index.js             # Entry point


---

## ⚙️ Setup Instructions

### *Prerequisites*
- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project
- Cloudinary account (for media uploads)

---

### *Frontend Setup*

1. Navigate to the frontend directory and install dependencies:
   bash
   cd frontend
   npm install
   

2. Create a .env file in the frontend root:

   env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Backend API URL
   VITE_API_URL=http://localhost:5000/api
   

3. Run the development server:

   bash
   npm run dev
   

---

### *Backend Setup*

1. Navigate to backend and install dependencies:

   bash
   cd backend
   npm install
   

2. Create a .env file in the backend root:

   env
   # Server
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGO_URI=your_mongodb_connection_string

   # Firebase Admin SDK
   TYPE=service_account
   PROJECT_ID=your_project_id
   PRIVATE_KEY_ID=your_private_key_id
   PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
   CLIENT_EMAIL=your_service_account_email
   CLIENT_ID=your_client_id
   AUTH_URI=https://accounts.google.com/o/oauth2/auth
   TOKEN_URI=https://oauth2.googleapis.com/token
   AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   CLIENT_X509_CERT_URL=your_cert_url
   UNIVERSE_DOMAIN=googleapis.com

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   

3. Run the backend server:

   bash
   npm start
   

---

## 📡 API Endpoints

### *Authentication*
- POST /api/auth/sync – Sync Firebase user with MongoDB

### *User*
- GET /api/user/profile – Get user profile
- PUT /api/user/profile – Update user profile

### *Family Circles*
- POST /api/family-circles – Create family circle
- GET /api/family-circles/:circleId – Get circle details
- GET /api/family-circles/:circleId/members – Get circle members
- POST /api/family-circles/:circleId/invite – Invite member
- DELETE /api/family-circles/:circleId/members/:memberId – Remove member
- POST /api/family-circles/:circleId/leave – Leave circle
- DELETE /api/family-circles/:circleId – Delete circle
- GET /api/family-circles/:circleId/tree – Get family tree data

### *Stories*
- POST /api/stories – Create story
- GET /api/stories/user – Get user's stories
- GET /api/stories/family-circle – Get family circle stories
- GET /api/stories/:storyId – Get specific story
- PUT /api/stories/:storyId – Update story
- DELETE /api/stories/:storyId – Delete story

### *Relationships*
- POST /api/relationships – Send relationship request
- GET /api/relationships/pending – Get pending requests
- PUT /api/relationships/:requestId – Respond to request
- GET /api/relationships/approved – Get approved relationships
- GET /api/relationships/admin/pending – Get pending relationships for admin
- PUT /api/relationships/admin/approve/:requestId – Admin approve relationship

### *Media*
- POST /api/media/upload/:storyId – Upload media file (images, videos, audio)

### *Search*
- GET /api/search?q=query – Search stories or members

---

## 🚀 Deployment

### *Frontend (Vercel)*

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - All VITE_FIREBASE_* variables
   - VITE_API_URL (your Render backend URL with /api)
4. Deploy

### *Backend (Render)*

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Add environment variables:
   - MONGO_URI
   - All Firebase Admin SDK variables
   - Cloudinary credentials
   - PORT (optional, Render sets automatically)
5. Deploy

*Important Configuration Notes:*
- Ensure all backend routes have /api prefix in index.js
- Configure CORS to allow your Vercel domain
- Set MongoDB Atlas to allow connections from 0.0.0.0/0 or add Render's IP ranges

---

## 🧾 Environment Variables Checklist

### *Vercel (Frontend)*
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID
- VITE_API_URL → https://your-backend.onrender.com/api

### *Render (Backend)*
- MONGO_URI
- TYPE
- PROJECT_ID
- PRIVATE_KEY_ID
- PRIVATE_KEY
- CLIENT_EMAIL
- CLIENT_ID
- AUTH_URI
- TOKEN_URI
- AUTH_PROVIDER_X509_CERT_URL
- CLIENT_X509_CERT_URL
- UNIVERSE_DOMAIN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- PORT (optional)

---

## 🧩 Common Issues & Fixes

### ⚠️ 404 Errors
*Symptoms:* Routes not found, "Route not found" errors

*Solutions:*
- Verify backend routes have /api prefix in index.js
- Ensure VITE_API_URL includes /api in the path
- Check that routes are registered correctly in backend

### 💥 500 Errors
*Symptoms:* Internal server errors, crashes

*Solutions:*
- Review Render logs for specific error messages
- Verify MongoDB connection string is correct
- Ensure Firebase Admin SDK credentials are properly formatted
- Check that all required environment variables are set
- Verify private key format (should include \n for line breaks)

### 🚫 CORS Errors
*Symptoms:* "Access-Control-Allow-Origin" errors, blocked requests

*Solutions:*
- Add your Vercel domain to CORS whitelist in backend
- Include credentials: true in CORS configuration
- Ensure frontend and backend both handle credentials properly

### 🔐 Authentication Issues
*Symptoms:* Unauthorized errors, token verification failures

*Solutions:*
- Ensure Firebase config matches in frontend and backend
- Confirm Firebase token is being sent in Authorization header
- Validate backend authMiddleware is correctly verifying tokens
- Check that Firebase Admin SDK is initialized properly
- Verify user exists in MongoDB after Firebase authentication

### 🐌 Render Free Tier Delays
*Symptoms:* Initial requests taking 30-60 seconds

*Solutions:*
- Render free tier spins down after inactivity
- Use a service like UptimeRobot to ping your backend every 5 minutes
- Add loading states in frontend to handle cold starts
- Consider upgrading to paid tier for production

---

## 🧰 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

---

## 📜 License

MIT License – feel free to use and modify this project.

See the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For questions or issues:
- Open a GitHub Issue
- Contact the development team
- Check existing issues for solutions

---

## 🙏 Acknowledgments

- Firebase for authentication services
- MongoDB for database hosting
- Cloudinary for media storage
- Vercel and Render for deployment platforms

---

*Built with ❤️ for preserving family legacies across generations.*
