# CampusLens Deployment Guide

This guide covers deploying both the frontend and backend of CampusLens to production.

## 📁 Project Structure

```
campuslens-fullstack/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express API
├── README.md
└── DEPLOYMENT.md
```

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project named "CampusLens"

### Step 2: Create Cluster
1. Click "Create a New Cluster"
2. Choose **M0 Sandbox** (Free tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "campuslens-cluster")
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User
1. Go to **Database Access** in left sidebar
2. Click "Add New Database User"
3. Choose **Password** authentication method
4. Create username and strong password
5. Set Database User Privileges to **"Read and write to any database"**
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to **Network Access** in left sidebar
2. Click "Add IP Address"
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production: Add your server's specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to **Clusters** and click "Connect"
2. Choose **"Connect your application"**
3. Select **Node.js** and version **4.1 or later**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `campuslens`

Example connection string:
```
mongodb+srv://username:password@campuslens-cluster.abc123.mongodb.net/campuslens?retryWrites=true&w=majority
```

## 🚀 Backend Deployment

### Option 1: Railway (Recommended)

1. **Sign up at [Railway](https://railway.app)**
2. **Connect GitHub repository**
3. **Deploy backend:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder as root directory
   - Railway will auto-detect Node.js

4. **Set Environment Variables:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campuslens?retryWrites=true&w=majority
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.vercel.app
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   PORT=5000
   ```

5. **Custom Start Command (if needed):**
   ```bash
   node server.js
   ```

### Option 2: Render

1. **Sign up at [Render](https://render.com)**
2. **Create Web Service:**
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`

3. **Set Environment Variables** (same as Railway)

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Deploy:**
   ```bash
   cd backend
   heroku create campuslens-api
   heroku config:set MONGODB_URI="your-connection-string"
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL="https://your-frontend-domain.com"
   heroku config:set JWT_SECRET="your-jwt-secret"
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Sign up at [Vercel](https://vercel.com)**
2. **Import Project:**
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set Root Directory to `frontend`
   - Framework Preset: **Vite**

3. **Environment Variables:**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key
   VITE_API_URL=https://your-backend-domain.railway.app/api
   ```

4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Option 2: Netlify

1. **Sign up at [Netlify](https://netlify.com)**
2. **Deploy:**
   - Drag and drop your `frontend/dist` folder after running `npm run build`
   - Or connect GitHub repository

3. **Environment Variables** (same as Vercel)

### Option 3: GitHub Pages

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Push `dist` folder to `gh-pages` branch
   - Enable GitHub Pages in repository settings

## 🔧 Production Configuration

### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campuslens?retryWrites=true&w=majority

# Server
NODE_ENV=production
PORT=5000

# CORS
CLIENT_URL=https://your-frontend-domain.vercel.app

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

### Frontend Environment Variables
```env
# Clerk (use production keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key

# API
VITE_API_URL=https://your-backend-domain.railway.app/api
```

## 🔒 Security Checklist

### Backend Security
- [ ] Use production MongoDB Atlas cluster
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure CORS with specific frontend domain
- [ ] Enable rate limiting
- [ ] Use HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Configure proper IP whitelist in MongoDB Atlas

### Frontend Security
- [ ] Use production Clerk keys
- [ ] Set proper CORS origins
- [ ] Use HTTPS for all API calls
- [ ] Validate all user inputs
- [ ] Implement proper error handling

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-domain.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "CampusLens API is running",
  "database": "Connected"
}
```

### Frontend Testing
1. Visit your frontend URL
2. Test user authentication (Clerk)
3. Test API connectivity
4. Test Excel upload functionality
5. Test student CRUD operations

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy CampusLens

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway/cli@v2
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` in backend matches frontend domain exactly
   - Check CORS configuration in `server.js`

2. **Database Connection Failed**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Environment Variables Not Working**
   - Restart your deployment service after adding variables
   - Check variable names (case-sensitive)
   - Ensure no trailing spaces in values

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check for TypeScript errors

### Logs and Monitoring
- **Railway**: View logs in Railway dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **MongoDB**: Monitor database performance in Atlas

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas connection and permissions

## 🎉 Success!

Once deployed, your CampusLens application will be accessible at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-api-name.railway.app/api`

Your users can now:
- ✅ Sign up and authenticate with Clerk
- ✅ Upload and manage student data via Excel
- ✅ View real-time analytics and filtering
- ✅ Access the application from anywhere
