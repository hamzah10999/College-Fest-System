# College Fest Token System with MongoDB

This is an automated token system for college fests built with Next.js, React, and MongoDB.

## Features

- Student registration with unique ID generation
- QR code generation and validation
- Real-time analytics dashboard
- MongoDB integration for persistent data storage
- RESTful API endpoints
- Responsive design with Tailwind CSS



## API Endpoints

- `GET /api/students` - Get all students (with search and filter)
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student by ID
- `POST /api/validate` - Validate student entry
- `GET /api/validate/recent` - Get recent validation scans
- `GET /api/analytics` - Get analytics data

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MongoDB with native driver
- **API**: Next.js API Routes
- **Validation**: Server-side validation
- **QR Codes**: Canvas-based generation

## Deployment:Vercel Deployment


