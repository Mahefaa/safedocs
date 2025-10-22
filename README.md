# SafeDocs - CS

A beautiful, modern web application for secure document storage and management, built with React, TailwindCSS, and Supabase.

![SafeDocs](https://img.shields.io/badge/React-19.1.1-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-2.75.1-3ecf8e)

## Features

- 🎨 **Beautiful UI** - Modern design with gradients, animations, and glass morphism
- 🔐 **Secure Authentication** - Email/password authentication via Supabase
- 📤 **Drag & Drop Upload** - Intuitive file upload with visual feedback
- 📁 **File Management** - View, download, and delete files with ease

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Mahefaa/safedocs.git
   cd safedocs
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```
5. **Open in browser**
   ```
   http://localhost:5173
   ```

## Tech Stack
### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **clsx & tailwind-merge** - Class name utilities

### Backend
- **Supabase** - Authentication & storage
- **PostgreSQL** - Database (via Supabase)
- **Supabase Storage** - File storage

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Configuration
### Supabase Setup
1. Create a Supabase project
2. Create a storage bucket named `safedocs`
3. Set up Row Level Security (RLS) policies
4. Create a `files` table (optional, for metadata)
