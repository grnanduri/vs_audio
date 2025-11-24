// Google Drive API integration utility
// You'll need to set up Google Drive API credentials and configure OAuth

class GoogleDriveService {
  constructor() {
    // Vite uses import.meta.env instead of process.env
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    this.scopes = 'https://www.googleapis.com/auth/drive.readonly';
    this.gapi = null;
    this.isSignedIn = false;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.apiKey,
              clientId: this.clientId,
              discoveryDocs: [this.discoveryDoc],
              scope: this.scopes
            });
            
            this.gapi = window.gapi;
            this.authInstance = this.gapi.auth2.getAuthInstance();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async signIn() {
    try {
      const authResult = await this.authInstance.signIn();
      this.isSignedIn = true;
      return authResult;
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await this.authInstance.signOut();
      this.isSignedIn = false;
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  }

  async getAudioFiles(folderName) {
    if (!this.isSignedIn) {
      throw new Error('User must be signed in to access Google Drive');
    }

    try {
      // First, find the folder by name
      const folderResponse = await this.gapi.client.drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
      });

      if (folderResponse.result.files.length === 0) {
        throw new Error(`Folder '${folderName}' not found`);
      }

      const folderId = folderResponse.result.files[0].id;

      // Get audio files from the folder
      const filesResponse = await this.gapi.client.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'audio/' or name contains '.mp3' or name contains '.wav' or name contains '.m4a')`,
        fields: 'files(id, name, size, modifiedTime, webContentLink)',
        orderBy: 'name'
      });

      return filesResponse.result.files.map(file => ({
        id: file.id,
        name: file.name,
        size: this.formatFileSize(file.size),
        modifiedTime: new Date(file.modifiedTime).toLocaleDateString(),
        url: file.webContentLink,
        duration: 'Unknown' // Duration would need to be extracted from audio metadata
      }));
    } catch (error) {
      console.error('Error fetching audio files:', error);
      throw error;
    }
  }

  formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  async getPublicAudioFiles(folderId) {
    // For public folders, you can use the public API without authentication
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType+contains+'audio/'+or+name+contains+'.mp3'+or+name+contains+'.wav'+or+name+contains+'.m4a')&key=${this.apiKey}&fields=files(id,name,size,modifiedTime,webContentLink)`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      
      const data = await response.json();
      return data.files.map(file => ({
        id: file.id,
        name: file.name,
        size: this.formatFileSize(file.size),
        modifiedTime: new Date(file.modifiedTime).toLocaleDateString(),
        url: file.webContentLink,
        duration: 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching public audio files:', error);
      throw error;
    }
  }
}

export default GoogleDriveService;
