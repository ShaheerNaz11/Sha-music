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
