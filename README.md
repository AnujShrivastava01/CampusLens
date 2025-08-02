# CampusLens - Student Data Management System

A full-stack web application for managing student data with Excel integration and real-time filtering capabilities.

## 🚨 **IMPORTANT: Environment Setup**

### **Backend Environment Variables**
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your actual credentials:
   - **MongoDB URI**: Get from [MongoDB Atlas](https://cloud.mongodb.com/)
   - **Clerk Secret Key**: Get from [Clerk Dashboard](https://dashboard.clerk.com/)

### **Frontend Environment Variables**
1. Copy `frontend/.env.example` to `frontend/.env`
2. Fill in your actual credentials:
   - **Clerk Publishable Key**: Get from [Clerk Dashboard](https://dashboard.clerk.com/)

⚠️ **Never commit `.env` files to Git!** They contain sensitive credentials.

## 🏗️ Project Structure

```
campuslens-fullstack/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # Node.js + Express API
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd campuslens-fullstack
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campuslens?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file in frontend folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
VITE_API_URL=http://localhost:5000/api
```

Start frontend development server:
```bash
npm run dev
```

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create a Cluster**
   - Click "Create a New Cluster"
   - Choose the free tier (M0 Sandbox)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Add `0.0.0.0/0` (allows access from anywhere)
   - For production: Add your specific IP addresses

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `campuslens`

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Use Local Connection String**
   ```env
   MONGODB_URI=mongodb://localhost:27017/campuslens
   ```

## 🔧 API Endpoints

### Students
- `GET /api/students` - Get all students (with filtering and pagination)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats/overview` - Get statistics

### File Upload
- `POST /api/upload/excel` - Upload and process Excel file
- `GET /api/upload/template` - Download Excel template
- `POST /api/upload/validate` - Validate Excel file without saving

### Health Check
- `GET /api/health` - API health status

## 📊 Excel Integration

### Supported Excel Columns
- Student ID (required)
- First Name (required)
- Last Name (required)
- Email (required)
- Phone
- Date of Birth
- Program (required)
- Year
- Semester
- GPA
- Credits
- Status

### Excel Upload Process
1. Download template from `/api/upload/template`
2. Fill in student data
3. Upload via the frontend interface
4. Review validation results
5. Confirm import

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service
3. Set environment variables in your hosting dashboard

### Backend Deployment (Railway/Render/Heroku)
1. Deploy the `backend` folder to your hosting service
2. Set environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend-domain.com`
   - `JWT_SECRET`

### Environment Variables

**Frontend (.env)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key
VITE_API_URL=https://your-backend-domain.com/api
```

**Backend (.env)**
```env
MONGODB_URI=your-mongodb-connection-string
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-jwt-secret
```

## 🛠️ Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Framer Motion
- React Router
- Clerk Authentication
- React Query

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file uploads)
- XLSX (Excel processing)
- Joi (validation)
- CORS
- Helmet (security)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.
