import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

const Admin = ({ fetchSongs }) => {
  const [form, setForm] = useState({ id: '', title: '', artist: '', album: '', cover_url: '', audio_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [adminSongs, setAdminSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (data) setAdminSongs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const songData = {
      title: form.title, artist: form.artist, album: form.album, cover_url: form.cover_url, audio_url: form.audio_url
    };

    if (isEditing) {
      await supabase.from('songs').update(songData).eq('id', form.id);
    } else {
      await supabase.from('songs').insert([songData]);
    }

    setForm({ id: '', title: '', artist: '', album: '', cover_url: '', audio_url: '' });
    setIsEditing(false);
    setLoading(false);
    loadSongs();
    fetchSongs(); // Refresh main app state
  };

  const handleEdit = (song) => {
    setForm(song);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this song?')) {
      await supabase.from('songs').delete().eq('id', id);
      loadSongs();
      fetchSongs();
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto', flex: 1, paddingBottom: 200, width: '100%', overflowY: 'auto' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Admin Dashboard</h1>
      </header>
      
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>{isEditing ? 'Edit Song' : 'Add New Song'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
          <input required placeholder="Artist" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} />
          <input placeholder="Album" value={form.album} onChange={e => setForm({...form, album: e.target.value})} style={inputStyle} />
          <input required type="url" placeholder="Cover URL" value={form.cover_url} onChange={e => setForm({...form, cover_url: e.target.value})} style={inputStyle} />
          <input required type="url" placeholder="Audio URL" value={form.audio_url} onChange={e => setForm({...form, audio_url: e.target.value})} style={inputStyle} />
          <button type="submit" disabled={loading} style={{ background: 'var(--primary-color)', color: 'black', padding: '14px 24px', borderRadius: 24, fontSize: '1rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Saving...' : (isEditing ? 'Update Song' : 'Save Song')}
          </button>
          {isEditing && (
            <button type="button" onClick={() => { setIsEditing(false); setForm({id:'', title:'', artist:'', album:'', cover_url:'', audio_url:''}) }} style={{ background: '#333', color: 'white', padding: '14px 24px', borderRadius: 24, border: 'none', cursor: 'pointer' }}>Cancel</button>
          )}
        </form>
      </motion.section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Manage Songs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {adminSongs.map(song => (
            <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8 }}>
              <div>
                <strong>{song.title}</strong><br/>
                <small style={{ color: 'var(--text-muted)' }}>{song.artist}</small>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleEdit(song)} style={{ background: 'transparent', border: 'none', color: '#3498db', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(song.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const inputStyle = { width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'white' };

export default Admin;
