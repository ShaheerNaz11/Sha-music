const songForm = document.getElementById('songForm');
const songIdInput = document.getElementById('songId');
const titleInput = document.getElementById('title');
const artistInput = document.getElementById('artist');
const albumInput = document.getElementById('album');
const coverUrlInput = document.getElementById('cover_url');
const audioUrlInput = document.getElementById('audio_url');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const adminSongList = document.getElementById('adminSongList');

let isEditing = false;

// Fetch and display songs in admin panel
async function fetchAdminSongs() {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching songs:', error);
        return;
    }

    renderAdminSongs(data);
}

function renderAdminSongs(songs) {
    adminSongList.innerHTML = '';
    songs.forEach(song => {
        const item = document.createElement('div');
        item.className = 'admin-song-item';
        item.innerHTML = `
            <div>
                <strong>${song.title}</strong><br>
                <small style="color: #a1a1aa;">${song.artist}</small>
            </div>
            <div class="admin-song-actions">
                <button class="edit-btn" onclick="editSong('${song.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteSong('${song.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        adminSongList.appendChild(item);
    });
}

// Handle Add / Update
songForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    const songData = {
        title: titleInput.value,
        artist: artistInput.value,
        album: albumInput.value,
        cover_url: coverUrlInput.value,
        audio_url: audioUrlInput.value
    };

    if (isEditing) {
        // Update existing song
        const { error } = await supabase
            .from('songs')
            .update(songData)
            .eq('id', songIdInput.value);

        if (error) alert('Error updating song: ' + error.message);
        else alert('Song updated successfully!');
    } else {
        // Insert new song
        const { error } = await supabase
            .from('songs')
            .insert([songData]);

        if (error) alert('Error adding song: ' + error.message);
        else alert('Song added successfully!');
    }

    resetForm();
    fetchAdminSongs();
});

// Edit Song setup
window.editSong = async (id) => {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        alert('Error fetching song details');
        return;
    }

    isEditing = true;
    formTitle.textContent = 'Edit Song';
    submitBtn.textContent = 'Update Song';
    cancelBtn.style.display = 'block';

    songIdInput.value = data.id;
    titleInput.value = data.title;
    artistInput.value = data.artist;
    albumInput.value = data.album || '';
    coverUrlInput.value = data.cover_url;
    audioUrlInput.value = data.audio_url;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Cancel Edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    isEditing = false;
    formTitle.textContent = 'Add New Song';
    submitBtn.textContent = 'Save Song';
    submitBtn.disabled = false;
    cancelBtn.style.display = 'none';
    songForm.reset();
    songIdInput.value = '';
}

// Delete Song
window.deleteSong = async (id) => {
    if (confirm('Are you sure you want to delete this song?')) {
        const { error } = await supabase
            .from('songs')
            .delete()
            .eq('id', id);

        if (error) alert('Error deleting song');
        else fetchAdminSongs();
    }
};

// Init
fetchAdminSongs();
