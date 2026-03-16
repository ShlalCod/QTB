/**
 * Media Manager for Cloudflare R2
 * Handles file uploads and media library management
 */

'use strict';

const MediaManager = {
    config: {
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm']
    },
    
    state: {
        files: [],
        selectedFiles: [],
        viewMode: 'grid'
    },
    
    init() {
        this.loadMedia();
    },
    
    createPanel(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="media-manager">
                <div class="media-header">
                    <div class="media-actions">
                        <button class="btn btn-primary btn-sm" onclick="MediaManager.openUploadDialog()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Upload Files
                        </button>
                    </div>
                </div>
                
                <div class="upload-zone" id="media-upload-zone">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Drag and drop files here</p>
                    <span class="upload-hint">or click to browse (max 50MB)</span>
                    <input type="file" id="media-file-input" multiple accept="image/*,video/*" style="display: none;">
                </div>
                
                <div class="media-grid" id="media-grid">
                    <!-- Media items will be rendered here -->
                </div>
            </div>
        `;
        
        this.setupDropZone();
        this.renderMedia();
    },
    
    setupDropZone() {
        const uploadZone = document.getElementById('media-upload-zone');
        const fileInput = document.getElementById('media-file-input');
        
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => fileInput.click());
            
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }
    },
    
    async handleFiles(files) {
        for (const file of files) {
            if (!this.config.allowedTypes.includes(file.type)) {
                showToast(`${file.name} is not a supported file type`, 'error');
                continue;
            }
            
            if (file.size > this.config.maxFileSize) {
                showToast(`${file.name} exceeds the maximum file size (50MB)`, 'error');
                continue;
            }
            
            await this.uploadFile(file);
        }
    },
    
    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/media', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast(`${file.name} uploaded successfully!`, 'success');
                await this.loadMedia();
                this.renderMedia();
            } else {
                showToast(result.error || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Upload failed. Please try again.', 'error');
        }
    },
    
    async loadMedia() {
        try {
            const response = await fetch('/api/media');
            const result = await response.json();
            
            if (result.success && result.files) {
                this.state.files = result.files;
            }
        } catch (error) {
            console.error('Load media error:', error);
        }
    },
    
    renderMedia() {
        const grid = document.getElementById('media-grid');
        if (!grid) return;
        
        if (this.state.files.length === 0) {
            grid.innerHTML = '<p class="empty-state">No media files uploaded yet</p>';
            return;
        }
        
        grid.innerHTML = this.state.files.map(file => `
            <div class="media-item" data-key="${file.key}">
                <div class="media-preview">
                    ${file.key.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ?
                        `<img src="${file.url}" alt="${file.key}" loading="lazy">` :
                        `<div class="file-icon">📁</div>`
                    }
                </div>
                <div class="media-info">
                    <span class="media-name">${file.key}</span>
                    <span class="media-size">${this.formatSize(file.size)}</span>
                </div>
                <div class="media-actions">
                    <button class="btn btn-sm btn-outline" onclick="MediaManager.copyUrl('${file.url}')" title="Copy URL">
                        📋
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="MediaManager.deleteFile('${file.key}')" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    copyUrl(url) {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl).then(() => {
            showToast('URL copied to clipboard!', 'success');
        });
    },
    
    async deleteFile(key) {
        if (!confirm('Are you sure you want to delete this file?')) return;
        
        try {
            const response = await fetch(`/api/media?key=${encodeURIComponent(key)}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('File deleted successfully', 'success');
                await this.loadMedia();
                this.renderMedia();
            } else {
                showToast(result.error || 'Delete failed', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Delete failed', 'error');
        }
    },
    
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    
    openUploadDialog() {
        document.getElementById('media-file-input')?.click();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('media-manager-container');
    if (container) {
        MediaManager.init();
        MediaManager.createPanel(container);
    }
});
