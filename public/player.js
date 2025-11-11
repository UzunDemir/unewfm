class StreamRadio {
    constructor() {
        this.audio = document.getElementById('audioStream');
        this.currentTrackElement = document.getElementById('currentTrack');
        this.currentArtistElement = document.getElementById('currentArtist');
        this.statusElement = document.getElementById('status');
        this.listenersCountElement = document.getElementById('listenersCount');
        this.progressElement = document.getElementById('progress');
        this.currentTimeElement = document.getElementById('currentTime');
        this.durationElement = document.getElementById('duration');
        
        this.currentTrack = null;
        this.updateInterval = null;
        
        this.initializeStream();
    }
    
    async initializeStream() {
        try {
            this.statusElement.textContent = '🟢 Подключено к эфиру';
            
            // Начинаем проигрывать поток
            this.audio.src = '/api/stream';
            this.audio.play().catch(e => {
                console.log('Autoplay blocked:', e);
                this.statusElement.textContent = '⏸ Нажмите play для начала прослушивания';
            });
            
            // Обновляем информацию о текущем треке
            this.startTrackInfoUpdates();
            
        } catch (error) {
            this.statusElement.textContent = '🔴 Ошибка подключения';
            console.error('Stream initialization error:', error);
        }
    }
    
    startTrackInfoUpdates() {
        // Обновляем информацию каждые 3 секунды
        this.updateInterval = setInterval(() => this.updateTrackInfo(), 3000);
        this.updateTrackInfo();
    }
    
    async updateTrackInfo() {
        try {
            const response = await fetch('/api/current');
            const trackInfo = await response.json();
            
            this.updateUI(trackInfo);
            
        } catch (error) {
            console.error('Failed to update track info:', error);
        }
    }
    
    updateUI(trackInfo) {
        // Обновляем информацию о треке
        if (this.currentTrack?.title !== trackInfo.title) {
            this.currentTrackElement.textContent = trackInfo.title;
            this.currentArtistElement.textContent = trackInfo.artist;
            this.currentTrack = trackInfo;
        }
        
        // Обновляем прогресс
        const progressPercent = (trackInfo.currentTime / trackInfo.duration) * 100;
        this.progressElement.style.width = `${progressPercent}%`;
        
        this.currentTimeElement.textContent = this.formatTime(trackInfo.currentTime);
        this.durationElement.textContent = this.formatTime(trackInfo.duration);
        
        // Обновляем количество слушателей
        this.listenersCountElement.textContent = trackInfo.listeners;
        
        // Обновляем статус
        if (trackInfo.isPlaying) {
            this.statusElement.textContent = '🟢 В ЭФИРЕ';
        } else {
            this.statusElement.textContent = '⏸ ПАУЗА';
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
}

// Автозапуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new StreamRadio();
});
