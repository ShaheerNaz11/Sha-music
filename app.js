let songs = [];
let currentSongIndex = -1;
let audio = new Audio();
let isPlaying = false;

const recentsList = document.getElementById('recentsList');
const quickPicksList = document.getElementById('quickPicksList');
const searchInput = document.getElementById('searchInput');

// Player Elements
const miniPlayer = document.getElementById('miniPlayer');
const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const volumeSlider = document.getElementById('volumeSlider');

// Fetch songs from Supabase
async function fetchSongs() {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching songs:', error);
        return;
    }

    songs = data;
    renderSongs(songs);
}

// Render songs to UI
function renderSongs(songsToRender) {
    recentsList.innerHTML = '';
    quickPicksList.innerHTML = '';

    songsToRender.forEach((song, index) => {
        // Find actual index in original array for playing
        const actualIndex = songs.findIndex(s => s.id === song.id);
        
        // Recents Item (Vertical)
        const recentItem = document.createElement('div');
        recentItem.className = 'list-item fade-in-up';
        recentItem.style.animationDelay = `${index * 0.05}s`;
        recentItem.innerHTML = `
            <img src="${song.cover_url}" alt="${song.title}">
            <div class="list-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <i class="fa-solid fa-ellipsis-vertical text-muted"></i>
        `;
        recentItem.addEventListener('click', () => playSong(actualIndex));
        recentsList.appendChild(recentItem);

        // Quick Picks Item (Horizontal)
        const pickItem = document.createElement('div');
        pickItem.className = 'card fade-in-up';
        pickItem.style.animationDelay = `${index * 0.05}s`;
        pickItem.innerHTML = `
            <img src="${song.cover_url}" alt="${song.title}">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        `;
        pickItem.addEventListener('click', () => playSong(actualIndex));
        quickPicksList.appendChild(pickItem);
    });
}

// Audio Player Logic
function playSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    
    audio.src = song.audio_url;
    audio.play();
    isPlaying = true;
    updatePlayerUI(song);
    updatePlayPauseBtn();
}

function togglePlay() {
    if (!audio.src) return;
    
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayPauseBtn();
    
    if(isPlaying) {
        playerCover.classList.add('playing');
    } else {
        playerCover.classList.remove('playing');
    }
}

function updatePlayerUI(song) {
    miniPlayer.classList.remove('hidden');
    playerCover.src = song.cover_url;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.classList.add('playing');
}

function updatePlayPauseBtn() {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
}

function playNext() {
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= songs.length) nextIndex = 0;
    playSong(nextIndex);
}

function playPrev() {
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;
    playSong(prevIndex);
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

// Progress Bar
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

audio.addEventListener('ended', playNext);

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if(duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// Volume
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(term) || 
        song.artist.toLowerCase().includes(term)
    );
    renderSongs(filteredSongs);
});

// Init
fetchSongs();
