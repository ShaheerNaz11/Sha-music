import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaCompass, FaLock, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef(new Audio());

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (data) setSongs(data);
  };

  const playSong = (index) => {
    if (index < 0 || index >= songs.length) return;
    setCurrentSongIndex(index);
    const song = songs[index];
    audioRef.current.src = song.audio_url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current.src) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= songs.length) nextIndex = 0;
    playSong(nextIndex);
  };

  const playPrev = () => {
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;
    playSong(prevIndex);
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', playNext);
    };
  }, [currentSongIndex, songs.length]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const currentSong = currentSongIndex >= 0 ? songs[currentSongIndex] : null;

  return (
    <Router>
      <div className="app-container">
        
        <Routes>
          <Route path="/" element={<Home songs={songs} playSong={playSong} />} />
          <Route path="/admin" element={<Admin fetchSongs={fetchSongs} />} />
        </Routes>

        {/* Mini Player */}
        <AnimatePresence>
          {currentSong && (
            <motion.div 
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: 800, borderRadius: 20, padding: '12px 24px',
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, flexWrap: 'wrap',
                marginLeft: '-45%', // To center via left 50% hack due to framer motion override
              }}
              className="glass"
            >
              <motion.img 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                src={currentSong.cover_url} 
                alt="Cover" 
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, overflow: 'hidden', minWidth: 150 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{currentSong.artist}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <FaStepBackward style={{ cursor: 'pointer' }} onClick={playPrev} size={20} />
                <button 
                  onClick={togglePlay} 
                  style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--text-main)', color: 'var(--bg-color)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>
                <FaStepForward style={{ cursor: 'pointer' }} onClick={playNext} size={20} />
              </div>
              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 8, cursor: 'pointer', position: 'absolute', bottom: 0, left: 0 }} onClick={(e) => {
                const width = e.currentTarget.clientWidth;
                const clickX = e.nativeEvent.offsetX;
                audioRef.current.currentTime = (clickX / width) * audioRef.current.duration;
              }}>
                <div style={{ height: '100%', background: 'var(--primary-color)', width: `${progress}%`, borderRadius: 2, transition: 'width 0.1s linear' }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Nav */}
        <nav className="glass" style={{
          position: 'fixed', bottom: 0, left: 0, width: '100%', height: 80, display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 'env(safe-area-inset-bottom)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 100
        }}>
          <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}><FaPlay size={20} /><span>Play</span></Link>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}><FaCompass size={20} /><span>Explore</span></Link>
          <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}><FaLock size={20} /><span>Admin</span></Link>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}><FaBookOpen size={20} /><span>Library</span></Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
