class SyncRadio {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.isPlaying = false;
        this.syncInterval = null;
        this.currentTrack = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.startSync();
    }
    
    initializeElements() {
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progress = document.getElementById('progress');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        this.albumArt = document.getElementById('albumArt');
        this.listenersCount = document.getElementById('listenersCount');
        this.syncStatus = document.getElementById('syncStatus');
        this.playlistItems = document.getElementById('playlistItems');
        this.addTrackBtn = document.getElementById('addTrackBtn');
    }
    
    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.changeTrack(-1));
        this.nextBtn.addEventListener('click', () => this.changeTrack(1));
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        this.addTrackBtn.addEventListener('click', () => this.addTrack());
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
        });
    }
    
    async startSync() {
        // Синхронизация каждые 3 секунды
        this.syncInterval = setInterval(() => this.syncWithServer(), 3000);
        await this.syncWithServer();
    }
    
    async syncWithServer() {
        try {
            const response = await fetch('/api/sync');
            const data = await response.json();
            
            this.updateUI(data);
            this.syncStatus.textContent = '🟢 Синхронизировано';
        } catch (error) {
            console.error('Sync error:', error);
            this.syncStatus.textContent = '🔴 Ошибка синхронизации';
        }
    }
    
    updateUI(data) {
        this.listenersCount.textContent = data.listeners;
        
        // Обновление информации о треке
        const currentTrack = data.playlist[data.currentTrack];
        if (this.currentTrack?.id !== currentTrack.id) {
            this.loadTrack(currentTrack);
        }
        
        // Синхронизация времени воспроизведения
        const targetTime = data.currentTime;
        const diff = Math.abs(this.audio.currentTime - targetTime);
        
        if (diff > 2) { // Если расхождение больше 2 секунд
            this.audio.currentTime = targetTime;
        }
        
        // Синхронизация состояния воспроизведения
        if (data.isPlaying && this.audio.paused) {
            this.audio.play().catch(console.error);
            this.playBtn.textContent = '⏸';
        } else if (!data.isPlaying && !this.audio.paused) {
            this.audio.pause();
            this.playBtn.textContent = '▶';
        }
        
        this.updatePlaylist(data.playlist, data.currentTrack);
    }
    
    loadTrack(track) {
        this.currentTrack = track;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        this.audio.src = track.url;
        this.durationEl.textContent = this.formatTime(track.duration);
    }
    
    updatePlaylist(playlist, currentIndex) {
        this.playlistItems.innerHTML = playlist.map((track, index) => `
            <div class="playlist-item ${index === currentIndex ? 'active' : ''}">
                <span class="track-number">${index + 1}</span>
                <span class="track-info">${track.title} - ${track.artist}</span>
                <span class="track-duration">${this.formatTime(track.duration)}</span>
            </div>
        `).join('');
    }
    
    async togglePlay() {
        const action = this.audio.paused ? 'play' : 'pause';
        await this.sendControlAction({ action });
    }
    
    async changeTrack(direction) {
        const response = await fetch('/api/sync');
        const data = await response.json();
        
        let newIndex = data.currentTrack + direction;
        if (newIndex < 0) newIndex = data.playlist.length - 1;
        if (newIndex >= data.playlist.length) newIndex = 0;
        
        await this.sendControlAction({ 
            action: 'change_track', 
            trackIndex: newIndex 
        });
    }
    
    async sendControlAction(actionData) {
        try {
            await fetch('/api/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(actionData)
            });
        } catch (error) {
            console.error('Control action error:', error);
        }
    }
    
    setProgress(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * this.audio.duration;
        
        this.audio.currentTime = newTime;
        this.sendControlAction({
            action: 'play',
            currentTime: newTime
        });
    }
    
    async addTrack() {
        const url = document.getElementById('trackUrl').value;
        const title = document.getElementById('trackTitleInput').value;
        const artist = document.getElementById('trackArtistInput').value;
        const duration = document.getElementById('trackDuration').value;
        
        if (!url || !title || !artist || !duration) {
            alert('Заполните все поля');
            return;
        }
        
        try {
            await fetch('/api/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, artist, duration, url })
            });
            
            // Очистка полей
            document.getElementById('trackUrl').value = '';
            document.getElementById('trackTitleInput').value = '';
            document.getElementById('trackArtistInput').value = '';
            document.getElementById('trackDuration').value = '';
            
            alert('Трек добавлен!');
        } catch (error) {
            console.error('Add track error:', error);
            alert('Ошибка добавления трека');
        }
    }
    
    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
}

// Запуск радио при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new SyncRadio();
});
