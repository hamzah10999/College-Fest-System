# College Fest Token System with MongoDB

This is an automated token system for college fests built with Next.js, React, and MongoDB.

## Features

- Student registration with unique ID generation
- QR code generation and validation
- Real-time analytics dashboard
- MongoDB integration for persistent data storage
- RESTful API endpoints
- Responsive design with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/college-fest`

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in .env.local

### 3. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/college-fest
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/students` - Get all students (with search and filter)
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student by ID
- `POST /api/validate` - Validate student entry
- `GET /api/validate/recent` - Get recent validation scans
- `GET /api/analytics` - Get analytics data

## Database Schema

### Students Collection
\`\`\`javascript
{
  _id: ObjectId,
  id: String, // Unique fest ID (FEST-timestamp-random)
  name: String,
  email: String,
  phone: String,
  college: String,
  role: String, // participant, volunteer, organizer, judge, sponsor
  registeredAt: Date,
  validated: Boolean,
  validatedAt: Date,
  qrCodeData: String
}
\`\`\`

### Validation Scans Collection
\`\`\`javascript
{
  _id: ObjectId,
  studentId: String,
  scannedAt: Date,
  scannedBy: String,
  method: String // 'qr' or 'manual'
}
\`\`\`

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MongoDB with native driver
- **API**: Next.js API Routes
- **Validation**: Server-side validation
- **QR Codes**: Canvas-based generation

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-fest
NEXTAUTH_SECRET=production-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
