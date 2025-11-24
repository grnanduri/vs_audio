# 🕉️ VS Audio Player

A rich, modern web application for listening to Vishnu Sahasranamam audio files from Google Drive. Features both Tutorial and Non-Tutorial modes with advanced playlist management and audio controls.

## ✨ Features

- **Google Drive Integration**: Direct access to audio files stored in Google Drive folders
- **Dual Mode Support**: Switch between Tutorial and Non-Tutorial audio collections
- **Multi-Select Playlist**: Select multiple audio files and add them to your playlist
- **Advanced Audio Controls**: Play, pause, seek, volume control, shuffle, and repeat modes
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Progress**: Visual progress bar with time display
- **Playlist Management**: Add, remove, and reorder tracks in your playlist

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- Google Cloud Console account
- Google Drive with audio files organized in "Tutorial" and "Non-tutorial" folders

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd vs_audio
   npm install
   ```

2. **Set up Google Drive API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Drive API
   - Create credentials (API Key and OAuth 2.0 Client ID)
   - Copy the example environment file:
     ```bash
     cp env.example .env
     ```
   - Fill in your Google API credentials in `.env`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Google Drive Setup

### 1. Create Google Cloud Project
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Note your project ID

### 2. Enable Google Drive API
- Go to "APIs & Services" > "Library"
- Search for "Google Drive API"
- Click "Enable"

### 3. Create Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "API Key"
- Copy the API key
- Click "Create Credentials" > "OAuth 2.0 Client ID"
- Set application type to "Web application"
- Add `http://localhost:3000` to authorized origins
- Copy the Client ID

### 4. Organize Your Audio Files
Create two folders in your Google Drive:
- **Tutorial** - Contains tutorial audio files
- **Non-tutorial** - Contains non-tutorial audio files

### 5. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

**Note:** Vite uses the `VITE_` prefix for environment variables (not `REACT_APP_`).

## 🎵 Usage

### Getting Started
1. **Sign In**: Click "Sign in with Google Drive" to authenticate
2. **Select Mode**: Choose between "Tutorial Mode" or "Non-Tutorial Mode"
3. **Browse Files**: View available audio files in the sidebar
4. **Select Tracks**: Click on files to select them (multi-select supported)
5. **Add to Playlist**: Click "Add Selected to Playlist" to add tracks
6. **Start Playing**: Use the audio controls to play your selected tracks

### Audio Controls
- **Play/Pause**: Main play button in the center
- **Skip**: Previous/Next track buttons
- **Seek**: Click on the progress bar to jump to any position
- **Volume**: Use the volume slider or mute button
- **Shuffle**: Randomize track order
- **Repeat**: Repeat current track, all tracks, or disable

### Playlist Management
- **Add Tracks**: Select multiple files and add them to playlist
- **Remove Tracks**: Click the "×" button on playlist items
- **Reorder**: Tracks play in the order they were added
- **View Playlist**: Toggle playlist visibility with the list icon

## 🎨 Customization

### Styling
The app uses CSS custom properties for easy theming. Key variables in `src/App.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --secondary-gradient: linear-gradient(135deg, #4285f4, #34a853);
  --error-gradient: linear-gradient(135deg, #ff4757, #ff3742);
}
```

### Adding New Audio Sources
To add support for other audio sources, modify the `GoogleDriveService` class in `src/services/googleDriveService.js`.

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure
```
src/
├── App.jsx              # Main application component
├── App.css              # Main styles
├── index.css            # Global styles
├── main.jsx             # React entry point
└── services/
    └── googleDriveService.js  # Google Drive API integration
```

## 🚀 Deploying to GitHub Pages

This app can be deployed to GitHub Pages for free hosting. The deployment is automated via GitHub Actions.

### Prerequisites

1. Push your code to a GitHub repository
2. Have your Google API credentials ready

### Step-by-Step Deployment

1. **Update the base path in `vite.config.js`:**
   - If your repository is named `vs_audio`, the base path should be `/vs_audio/`
   - If deploying to a custom domain or root, use `/`
   - The current config uses `/vs_audio/` - update if your repo name is different

2. **Set up GitHub Secrets:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret** and add:
     - `VITE_GOOGLE_API_KEY` - Your Google API Key
     - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
     - `VITE_TUTORIAL_FOLDER_ID` (optional) - Tutorial folder ID
     - `VITE_NON_TUTORIAL_FOLDER_ID` (optional) - Non-Tutorial folder ID

3. **Update Google OAuth Settings:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** → **Credentials**
   - Edit your OAuth 2.0 Client ID
   - Add your GitHub Pages URL to **Authorized JavaScript origins**:
     ```
     https://[your-username].github.io
     ```
   - Add to **Authorized redirect URIs**:
     ```
     https://[your-username].github.io/vs_audio/
     ```
   - Replace `[your-username]` and `vs_audio` with your actual GitHub username and repository name

4. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main`

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

6. **Access your app:**
   Your app will be available at:
   ```
   https://[your-username].github.io/vs_audio/
   ```

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the app
npm run build

# The dist/ folder contains the built files
# You can deploy this folder to GitHub Pages using gh-pages or manually
```

### Important Notes

- ⚠️ **Environment Variables**: Make sure all required environment variables are set as GitHub Secrets
- ⚠️ **OAuth Redirect URIs**: Must include your GitHub Pages URL in Google Cloud Console
- ⚠️ **Base Path**: Update `vite.config.js` if your repository name differs from `vs_audio`
- ✅ **Automatic Deploys**: Every push to `main` will trigger a new deployment
- ✅ **Build Artifacts**: The workflow builds and deploys automatically

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your Google API keys secure
- Use environment variables for all sensitive configuration
- Consider implementing additional authentication for production use

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to initialize Google Drive service"**
   - Check your API key and client ID in `.env`
   - Ensure Google Drive API is enabled in Google Cloud Console

2. **"Folder not found"**
   - Verify folder names are exactly "Tutorial" and "Non-tutorial"
   - Check folder permissions in Google Drive

3. **Audio not playing**
   - Ensure audio files are publicly accessible
   - Check browser console for CORS errors
   - Verify audio file formats are supported

4. **Sign-in issues**
   - Clear browser cache and cookies
   - Check OAuth redirect URIs in Google Cloud Console
   - Ensure your GitHub Pages URL (e.g., `https://[username].github.io/vs_audio/`) is in authorized origins
   - For local development, ensure `http://localhost:3000` is in authorized origins

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React and Vite
- Icons by Lucide React
- Google Drive API for file access
- Inspired by the sacred Vishnu Sahasranamam