import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home = ({ songs, playSong }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 5%', paddingBottom: 200 }}>
      {/* Top Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-color)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Listen Now</h1>
        <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </header>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px auto' }}>
        <input 
          type="text" 
          placeholder="Search songs, artists..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 20, border: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
        />
      </div>

      {/* Quick Picks */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Quick Picks</h2>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
          {filteredSongs.map((song, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
              key={song.id}
              onClick={() => playSong(songs.indexOf(song))}
              style={{ flex: '0 0 180px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, cursor: 'pointer' }}
            >
              <img src={song.cover_url} alt={song.title} style={{ width: '100%', height: 148, borderRadius: 12, objectFit: 'cover', marginBottom: 16 }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>{song.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{song.artist}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recents */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Recents</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filteredSongs.map((song, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              key={song.id}
              onClick={() => playSong(songs.indexOf(song))}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, borderRadius: 12, cursor: 'pointer' }}
            >
              <img src={song.cover_url} alt={song.title} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 4 }}>{song.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{song.artist}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
