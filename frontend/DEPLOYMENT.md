# 🚀 CampusLens Deployment Guide

This guide will help you deploy CampusLens - a full-stack student data management platform.

## 📋 Prerequisites

1. Node.js and npm installed
2. Vercel account for frontend deployment
3. Supabase account for backend/database
4. Git repository (GitHub recommended)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be set up

### 2. Database Schema
Run the following SQL in your Supabase SQL editor:

```sql
-- Create students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  mobile_number VARCHAR NOT NULL,
  branch VARCHAR NOT NULL,
  sheet_name VARCHAR NOT NULL,
  upload_date TIMESTAMP DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create uploaded_files table
CREATE TABLE uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR NOT NULL,
  upload_date TIMESTAMP DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all students" ON students
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert students" ON students
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their students" ON students
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their students" ON students
  FOR DELETE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can view all files" ON uploaded_files
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert files" ON uploaded_files
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their files" ON uploaded_files
  FOR DELETE USING (auth.uid() = uploaded_by);
```

### 3. Authentication Setup
1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Google OAuth:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to your domain

## 🌐 Frontend Deployment (Vercel)

### 1. Environment Variables
Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add the environment variables in Vercel dashboard
3. Deploy!

**Or use Vercel CLI:**
```bash
npm install -g vercel
vercel --prod
```

## 🔐 Google OAuth Setup

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### 2. Configure OAuth
- **Authorized JavaScript origins:** `https://your-domain.com`
- **Authorized redirect URIs:** `https://your-supabase-url.supabase.co/auth/v1/callback`

### 3. Update Supabase
Add your Google OAuth credentials in Supabase Authentication settings.

## 📊 Excel Upload Feature

The app supports:
- `.xlsx` files
- `.csv` files
- Automatic parsing of columns: Name, Mobile Number, Branch
- Data validation and error handling

## 🛠️ Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd campus-lens

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🔧 Environment Variables Reference

### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📱 Features Included

✅ Google OAuth Authentication
✅ Excel/CSV file upload
✅ Student data management
✅ Advanced filtering and search
✅ Responsive design
✅ Dark/Light mode
✅ Real-time updates
✅ Data export functionality

## 🚀 Production Checklist

- [ ] Supabase project configured
- [ ] Database schema created
- [ ] RLS policies enabled
- [ ] Google OAuth configured
- [ ] Environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication not working**
   - Check Google OAuth redirect URLs
   - Verify Supabase auth settings

2. **File upload fails**
   - Check file format (.xlsx or .csv)
   - Ensure proper column headers

3. **Database connection issues**
   - Verify Supabase URL and keys
   - Check RLS policies

## 📧 Support

For support, contact: [your-email@domain.com]

---

**Made with ❤️ by Anuj**