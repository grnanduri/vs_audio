import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  List,
  FolderOpen,
  CheckSquare,
  Square,
  LogIn,
  LogOut,
  Loader,
  AlertCircle
} from 'lucide-react'
import './App.css'

// Mock data for demonstration
const mockAudioFiles = {
  tutorial: [
    { id: '1', name: 'Vishnu Sahasranamam - Tutorial Part 1', duration: '45:30', url: '/audio/tutorial-1.mp3' },
    { id: '2', name: 'Vishnu Sahasranamam - Tutorial Part 2', duration: '42:15', url: '/audio/tutorial-2.mp3' },
    { id: '3', name: 'Vishnu Sahasranamam - Tutorial Part 3', duration: '38:45', url: '/audio/tutorial-3.mp3' },
  ],
  nonTutorial: [
    { id: '4', name: 'Vishnu Sahasranamam - Complete Chanting', duration: '1:25:30', url: '/audio/complete.mp3' },
    { id: '5', name: 'Vishnu Sahasranamam - Morning Chant', duration: '1:20:15', url: '/audio/morning.mp3' },
    { id: '6', name: 'Vishnu Sahasranamam - Evening Chant', duration: '1:18:45', url: '/audio/evening.mp3' },
  ]
}

function App() {
  const [currentMode, setCurrentMode] = useState('tutorial')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [shuffleMode, setShuffleMode] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none')
  const [showPlaylist, setShowPlaylist] = useState(false)
  
  // Simplified states for demo
  const [isSignedIn, setIsSignedIn] = useState(true) // Set to true for demo
  const [isLoading, setIsLoading] = useState(false)
  const [audioFiles, setAudioFiles] = useState(mockAudioFiles)
  const [error, setError] = useState(null)
  
  const audioRef = useRef(null)

  const currentTrack = playlist[currentTrackIndex]

  // Load audio files when mode changes
  useEffect(() => {
    setAudioFiles(mockAudioFiles)
  }, [currentMode])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (currentTrack) {
      const audio = audioRef.current
      if (audio) {
        audio.src = currentTrack.url
        if (isPlaying) {
          audio.play()
        }
      }
    }
  }, [currentTrack, isPlaying])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (repeatMode === 'one') {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }
      return
    }

    if (shuffleMode) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      const nextIndex = (currentTrackIndex + 1) % playlist.length
      if (nextIndex === 0 && repeatMode === 'none') {
        setIsPlaying(false)
        return
      }
      setCurrentTrackIndex(nextIndex)
    }
  }

  const handlePrevious = () => {
    if (shuffleMode) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
      setCurrentTrackIndex(prevIndex)
    }
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFileSelection = (file) => {
    setSelectedFiles(prev => 
      prev.some(f => f.id === file.id) 
        ? prev.filter(f => f.id !== file.id)
        : [...prev, file]
    )
  }

  const addToPlaylist = () => {
    if (selectedFiles.length === 0) return
    
    const newPlaylist = [...playlist, ...selectedFiles]
    setPlaylist(newPlaylist)
    setSelectedFiles([])
    
    if (playlist.length === 0) {
      setCurrentTrackIndex(0)
    }
  }

  const removeFromPlaylist = (index) => {
    const newPlaylist = playlist.filter((_, i) => i !== index)
    setPlaylist(newPlaylist)
    
    if (index === currentTrackIndex && newPlaylist.length > 0) {
      setCurrentTrackIndex(Math.min(currentTrackIndex, newPlaylist.length - 1))
    } else if (newPlaylist.length === 0) {
      setIsPlaying(false)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🕉️ Vishnu Sahasranamam Audio Player</h1>
        <p>Listen to sacred chants in Tutorial or Non-Tutorial mode</p>
        
        <div className="auth-section">
          <div className="demo-notice">
            <span>🎵 Demo Mode - Using sample audio files</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="main-content">
        <div className="sidebar">
          <div className="mode-selector">
            <button 
              className={`mode-btn ${currentMode === 'tutorial' ? 'active' : ''}`}
              onClick={() => setCurrentMode('tutorial')}
            >
              <FolderOpen size={20} />
              Tutorial Mode
            </button>
            <button 
              className={`mode-btn ${currentMode === 'nonTutorial' ? 'active' : ''}`}
              onClick={() => setCurrentMode('nonTutorial')}
            >
              <FolderOpen size={20} />
              Non-Tutorial Mode
            </button>
          </div>

          <div className="file-browser">
            <h3>Available Audio Files</h3>
            
            <div className="file-list">
              {audioFiles[currentMode].map(file => (
                <div 
                  key={file.id} 
                  className={`file-item ${selectedFiles.some(f => f.id === file.id) ? 'selected' : ''}`}
                  onClick={() => toggleFileSelection(file)}
                >
                  <div className="file-checkbox">
                    {selectedFiles.some(f => f.id === file.id) ? 
                      <CheckSquare size={16} className="checked" /> : 
                      <Square size={16} className="unchecked" />
                    }
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-details">
                      <span className="file-duration">{file.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="add-to-playlist-btn"
              onClick={addToPlaylist}
              disabled={selectedFiles.length === 0}
            >
              Add Selected to Playlist ({selectedFiles.length})
            </button>
          </div>

          <div className="playlist-section">
            <div className="playlist-header">
              <h3>Current Playlist</h3>
              <button 
                className="playlist-toggle"
                onClick={() => setShowPlaylist(!showPlaylist)}
              >
                <List size={20} />
              </button>
            </div>
            
            {showPlaylist && (
              <div className="playlist">
                {playlist.length === 0 ? (
                  <p className="empty-playlist">No tracks in playlist</p>
                ) : (
                  playlist.map((track, index) => (
                    <div 
                      key={track.id} 
                      className={`playlist-item ${index === currentTrackIndex ? 'current' : ''}`}
                    >
                      <div className="track-info">
                        <div className="track-name">{track.name}</div>
                        <div className="track-duration">{track.duration}</div>
                      </div>
                      <button 
                        className="remove-track"
                        onClick={() => removeFromPlaylist(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="player-section">
          {currentTrack ? (
            <div className="current-track-info">
              <h2>{currentTrack.name}</h2>
              <p>Track {currentTrackIndex + 1} of {playlist.length}</p>
            </div>
          ) : (
            <div className="no-track">
              <h2>No track selected</h2>
              <p>Add some tracks to your playlist to start listening</p>
            </div>
          )}

          <div className="progress-section">
            <span className="time">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleSeek}>
              <div 
                className="progress-fill" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="time">{formatTime(duration)}</span>
          </div>

          <div className="controls">
            <button 
              className="control-btn shuffle"
              onClick={() => setShuffleMode(!shuffleMode)}
              data-active={shuffleMode}
            >
              <Shuffle size={24} />
            </button>
            
            <button className="control-btn" onClick={handlePrevious}>
              <SkipBack size={24} />
            </button>
            
            <button className="control-btn play-pause" onClick={togglePlayPause}>
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            
            <button className="control-btn" onClick={handleNext}>
              <SkipForward size={24} />
            </button>
            
            <button 
              className="control-btn repeat"
              onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
              data-mode={repeatMode}
            >
              <Repeat size={24} />
            </button>
          </div>

          <div className="volume-section">
            <button className="volume-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span className="volume-value">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  )
}

export default App