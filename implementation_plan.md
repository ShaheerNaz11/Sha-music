# Implementation Plan: Music Streaming Dynamic Website

## 1. Project Overview
We have built a dynamic website using React, Vite, and Framer Motion. This approach provides a fast, seamless experience where switching between the User view and Admin dashboard happens instantly.

## 2. Technology Stack
*   **Frontend Framework**: React (via Vite)
*   **Routing**: `react-router-dom` for dynamic page switching.
*   **Animations**: `framer-motion` for smooth, ReactBits-style animations.
*   **Styling**: Pure CSS (`index.css`) utilizing a premium dark theme and glassmorphism.
*   **Backend / Database**: Supabase for storing song metadata.
*   **Media Hosting**: Cloudinary (Audio & Image URLs).

## 3. Application Structure
*   **`/` (Home)**: The main user interface with quick picks, recent songs, a search bar, and the floating glassmorphism mini-player.
*   **`/admin` (Admin)**: The admin dashboard to Add, Edit, and Delete songs.

## 4. Setup Instructions & SQL Schema

### Running the App
To run this dynamic website, you will need Node.js installed on your computer.
1. Download Node.js from [nodejs.org](https://nodejs.org/) and install it.
2. Open your terminal and navigate to the project directory:
   `cd "d:\shaheer\Sha music\streamify-react"`
3. Install dependencies:
   `npm install`
4. Start the server:
   `npm run dev`

### Supabase Database Setup
Before the app can fetch or save songs, you must create the `songs` table in your Supabase project.

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and go to the SQL Editor.
2. Run the following SQL script to set up the table and security policies:

```sql
-- 1. Create the songs table
CREATE TABLE songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 3. Create access policies
-- Allow anyone to read the songs (User side)
CREATE POLICY "Allow public read access" 
ON songs FOR SELECT USING (true);

-- Allow anyone to add, edit, and delete songs (Admin side)
CREATE POLICY "Allow public write access" 
ON songs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON songs FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" 
ON songs FOR DELETE USING (true);
```

## 5. Completed Features
- [x] Dynamic React rendering (SPA).
- [x] Modern dark theme with Glassmorphism mini-player.
- [x] Supabase integration (Fetch, Insert, Update, Delete).
- [x] Play, Pause, Next, Prev, Progress tracking, and Volume controls.
- [x] Framer motion animations applied.
