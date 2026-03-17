/**
 * Professional Block-Based Content Editor
 * Built with TipTap for rich text editing
 * 
 * Features:
 * - Block-based layout system
 * - Rich text editing (bold, italic, colors, fonts, sizes)
 * - Text effects (wave, jitter, glow, distortion)
 * - Media management (upload, crop, optimize)
 * - Animations and hover effects
 * - Section/category management
 * - Version history
 * - SEO tools
 */

'use strict';

// ============================================
// Block Editor Configuration
// ============================================

const BlockEditorConfig = {
    version: '2.0.0',
    
    // Block Types
    blockTypes: {
        paragraph: {
            name: 'Paragraph',
            icon: '📝',
            category: 'text',
            defaultContent: ''
        },
        heading: {
            name: 'Heading',
            icon: '📰',
            category: 'text',
            levels: [1, 2, 3, 4, 5, 6],
            defaultContent: ''
        },
        image: {
            name: 'Image',
            icon: '🖼️',
            category: 'media',
            defaultContent: { url: '', alt: '', caption: '' }
        },
        video: {
            name: 'Video',
            icon: '🎬',
            category: 'media',
            defaultContent: { url: '', type: 'youtube' }
        },
        gallery: {
            name: 'Gallery',
            icon: '🎨',
            category: 'media',
            defaultContent: { images: [], layout: 'grid' }
        },
        quote: {
            name: 'Quote',
            icon: '💬',
            category: 'text',
            defaultContent: { text: '', author: '' }
        },
        code: {
            name: 'Code Block',
            icon: '💻',
            category: 'text',
            defaultContent: { code: '', language: 'javascript' }
        },
        list: {
            name: 'List',
            icon: '📋',
            category: 'text',
            types: ['bullet', 'ordered'],
            defaultContent: []
        },
        divider: {
            name: 'Divider',
            icon: '➖',
            category: 'layout',
            defaultContent: { style: 'solid' }
        },
        spacer: {
            name: 'Spacer',
            icon: '↕️',
            category: 'layout',
            defaultContent: { height: 40 }
        },
        columns: {
            name: 'Columns',
            icon: '▮▮',
            category: 'layout',
            defaultContent: { columns: 2, gap: 20 }
        },
        button: {
            name: 'Button',
            icon: '🔘',
            category: 'interactive',
            defaultContent: { text: 'Click Here', url: '', style: 'primary' }
        },
        embed: {
            name: 'Embed',
            icon: '🔗',
            category: 'media',
            defaultContent: { url: '', type: 'generic' }
        },
        callout: {
            name: 'Callout',
            icon: '💡',
            category: 'text',
            defaultContent: { text: '', type: 'info' }
        },
        table: {
            name: 'Table',
            icon: '📊',
            category: 'data',
            defaultContent: { rows: 3, cols: 3 }
        }
    },
    
    // Text Formatting Options
    textFormats: {
        bold: { name: 'Bold', icon: 'B', shortcut: 'Ctrl+B' },
        italic: { name: 'Italic', icon: 'I', shortcut: 'Ctrl+I' },
        underline: { name: 'Underline', icon: 'U', shortcut: 'Ctrl+U' },
        strikethrough: { name: 'Strikethrough', icon: 'S', shortcut: 'Ctrl+Shift+X' },
        code: { name: 'Code', icon: '</>', shortcut: 'Ctrl+E' },
        highlight: { name: 'Highlight', icon: '🖍️' },
        link: { name: 'Link', icon: '🔗', shortcut: 'Ctrl+K' }
    },
    
    // Font Options
    fonts: [
        { name: 'Default', value: 'inherit' },
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Poppins', value: 'Poppins, sans-serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Open Sans', value: 'Open Sans, sans-serif' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif' },
        { name: 'Playfair Display', value: 'Playfair Display, serif' },
        { name: 'Source Code Pro', value: 'Source Code Pro, monospace' }
    ],
    
    // Font Sizes
    fontSizes: [
        { name: 'XS', value: '12px' },
        { name: 'SM', value: '14px' },
        { name: 'Base', value: '16px' },
        { name: 'LG', value: '18px' },
        { name: 'XL', value: '20px' },
        { name: '2XL', value: '24px' },
        { name: '3XL', value: '30px' },
        { name: '4XL', value: '36px' },
        { name: '5XL', value: '48px' },
        { name: '6XL', value: '64px' }
    ],
    
    // Color Palette
    colors: {
        primary: ['#0E7C86', '#109BA7', '#12BAC8', '#14D9E9'],
        accent: ['#FF6B5F', '#FF8A80', '#FFA99B', '#FFC8BC'],
        neutral: ['#FFFFFF', '#F8FAFC', '#E2E8F0', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A'],
        semantic: {
            success: '#22C55E',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6'
        }
    },
    
    // Animation Presets
    animations: {
        fade: { name: 'Fade', keyframes: 'fadeIn' },
        slideUp: { name: 'Slide Up', keyframes: 'slideUp' },
        slideDown: { name: 'Slide Down', keyframes: 'slideDown' },
        slideLeft: { name: 'Slide Left', keyframes: 'slideLeft' },
        slideRight: { name: 'Slide Right', keyframes: 'slideRight' },
        zoom: { name: 'Zoom', keyframes: 'zoomIn' },
        bounce: { name: 'Bounce', keyframes: 'bounce' },
        pulse: { name: 'Pulse', keyframes: 'pulse' },
        shake: { name: 'Shake', keyframes: 'shake' },
        rotate: { name: 'Rotate', keyframes: 'rotate' },
        flip: { name: 'Flip', keyframes: 'flip' }
    },
    
    // Text Effects
    textEffects: {
        wave: {
            name: 'Wave',
            css: 'animation: wave 2s ease-in-out infinite;'
        },
        jitter: {
            name: 'Jitter',
            css: 'animation: jitter 0.3s ease-in-out infinite;'
        },
        glow: {
            name: 'Glow',
            css: 'animation: glow 2s ease-in-out infinite alternate;'
        },
        glitch: {
            name: 'Glitch',
            css: 'animation: glitch 1s ease-in-out infinite;'
        },
        typewriter: {
            name: 'Typewriter',
            css: 'animation: typewriter 4s steps(40) infinite;'
        },
        rainbow: {
            name: 'Rainbow',
            css: 'animation: rainbow 3s linear infinite;'
        },
        bounce: {
            name: 'Bounce Text',
            css: 'animation: bounceText 1s ease-in-out infinite;'
        },
        float: {
            name: 'Float',
            css: 'animation: float 3s ease-in-out infinite;'
        }
    }
};

// ============================================
// Block Editor State
// ============================================

const BlockEditorState = {
    blocks: [],
    selectedBlock: null,
    clipboard: null,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    currentSection: null,
    sections: [],
    media: {
        images: [],
        videos: [],
        documents: []
    },
    settings: {
        autoSave: true,
        autoSaveInterval: 30000,
        showGridLines: false,
        snapToGrid: true,
        gridSize: 8
    }
};

// ============================================
// Block Editor Class
// ============================================

class BlockEditor {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = { ...BlockEditorConfig, ...options };
        this.state = { ...BlockEditorState };
        this.toolbar = null;
        this.editorArea = null;
        this.sidebar = null;
        
        this.init();
    }
    
    init() {
        this.createEditorStructure();
        this.createToolbar();
        this.createSidebar();
        this.createEditorArea();
        this.setupEventListeners();
        this.loadSavedContent();
        this.startAutoSave();
    }
    
    // Create main editor structure
    createEditorStructure() {
        this.container.innerHTML = `
            <div class="block-editor">
                <div class="editor-toolbar" id="editor-toolbar"></div>
                <div class="editor-main">
                    <div class="editor-sidebar" id="editor-sidebar"></div>
                    <div class="editor-content" id="editor-content"></div>
                    <div class="editor-properties" id="editor-properties"></div>
                </div>
                <div class="editor-statusbar">
                    <span class="block-count">Blocks: <strong>0</strong></span>
                    <span class="word-count">Words: <strong>0</strong></span>
                    <span class="last-saved">Last saved: <strong>Never</strong></span>
                </div>
            </div>
        `;
        
        this.toolbar = this.container.querySelector('#editor-toolbar');
        this.editorArea = this.container.querySelector('#editor-content');
        this.sidebar = this.container.querySelector('#editor-sidebar');
        this.properties = this.container.querySelector('#editor-properties');
    }
    
    // Create toolbar
    createToolbar() {
        this.toolbar.innerHTML = `
            <div class="toolbar-group toolbar-left">
                <button class="toolbar-btn" data-action="undo" title="Undo (Ctrl+Z)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
                    </svg>
                </button>
                <button class="toolbar-btn" data-action="redo" title="Redo (Ctrl+Y)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 7v6h-6"></path>
                        <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"></path>
                    </svg>
                </button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn" data-action="copy" title="Copy Block">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                    </svg>
                </button>
                <button class="toolbar-btn" data-action="paste" title="Paste Block">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                </button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn" data-action="delete-block" title="Delete Block">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </div>
            
            <div class="toolbar-group toolbar-center">
                <div class="toolbar-dropdown">
                    <button class="toolbar-btn dropdown-toggle" data-dropdown="font-family">
                        <span>Font</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu" id="font-family-menu"></div>
                </div>
                
                <div class="toolbar-dropdown">
                    <button class="toolbar-btn dropdown-toggle" data-dropdown="font-size">
                        <span>Size</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu" id="font-size-menu"></div>
                </div>
                
                <div class="toolbar-divider"></div>
                
                <button class="toolbar-btn format-btn" data-format="bold" title="Bold (Ctrl+B)">
                    <strong>B</strong>
                </button>
                <button class="toolbar-btn format-btn" data-format="italic" title="Italic (Ctrl+I)">
                    <em>I</em>
                </button>
                <button class="toolbar-btn format-btn" data-format="underline" title="Underline (Ctrl+U)">
                    <u>U</u>
                </button>
                <button class="toolbar-btn format-btn" data-format="strikethrough" title="Strikethrough">
                    <s>S</s>
                </button>
                
                <div class="toolbar-divider"></div>
                
                <div class="toolbar-dropdown">
                    <button class="toolbar-btn color-btn dropdown-toggle" data-dropdown="text-color">
                        <span class="color-indicator" style="background: currentColor;">A</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu color-picker" id="text-color-menu"></div>
                </div>
                
                <div class="toolbar-dropdown">
                    <button class="toolbar-btn color-btn dropdown-toggle" data-dropdown="bg-color">
                        <span class="color-indicator bg-indicator">🎨</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu color-picker" id="bg-color-menu"></div>
                </div>
                
                <div class="toolbar-divider"></div>
                
                <button class="toolbar-btn format-btn" data-format="link" title="Insert Link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path>
                    </svg>
                </button>
                
                <div class="toolbar-divider"></div>
                
                <div class="toolbar-dropdown">
                    <button class="toolbar-btn dropdown-toggle" data-dropdown="text-effect">
                        <span>✨ Effects</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu" id="text-effect-menu"></div>
                </div>
                
                <div class="toolbar-dropdown">
                    <button class="toolbar-btn dropdown-toggle" data-dropdown="animation">
                        <span>🎬 Animate</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu" id="animation-menu"></div>
                </div>
            </div>
            
            <div class="toolbar-group toolbar-right">
                <button class="toolbar-btn" data-action="toggle-grid" title="Toggle Grid">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="3" y1="15" x2="21" y2="15"></line>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                        <line x1="15" y1="3" x2="15" y2="21"></line>
                    </svg>
                </button>
                <button class="toolbar-btn" data-action="preview" title="Preview">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button class="toolbar-btn btn-primary" data-action="save" title="Save">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save
                </button>
            </div>
        `;
        
        this.populateDropdowns();
    }
    
    // Populate dropdown menus
    populateDropdowns() {
        // Font family
        const fontMenu = this.toolbar.querySelector('#font-family-menu');
        fontMenu.innerHTML = this.options.fonts.map(font => `
            <button class="dropdown-item" data-font="${font.value}" style="font-family: ${font.value}">
                ${font.name}
            </button>
        `).join('');
        
        // Font size
        const sizeMenu = this.toolbar.querySelector('#font-size-menu');
        sizeMenu.innerHTML = this.options.fontSizes.map(size => `
            <button class="dropdown-item" data-size="${size.value}">
                ${size.name} (${size.value})
            </button>
        `).join('');
        
        // Text color
        const colorMenu = this.toolbar.querySelector('#text-color-menu');
        colorMenu.innerHTML = this.createColorPicker('text-color');
        
        // Background color
        const bgColorMenu = this.toolbar.querySelector('#bg-color-menu');
        bgColorMenu.innerHTML = this.createColorPicker('bg-color');
        
        // Text effects
        const effectMenu = this.toolbar.querySelector('#text-effect-menu');
        effectMenu.innerHTML = Object.entries(this.options.textEffects).map(([key, effect]) => `
            <button class="dropdown-item" data-effect="${key}">
                ${effect.name}
            </button>
        `).join('');
        
        // Animations
        const animMenu = this.toolbar.querySelector('#animation-menu');
        animMenu.innerHTML = Object.entries(this.options.animations).map(([key, anim]) => `
            <button class="dropdown-item" data-animation="${key}">
                ${anim.name}
            </button>
        `).join('');
    }
    
    // Create color picker HTML
    createColorPicker(type) {
        const colors = this.options.colors;
        let html = '<div class="color-grid">';
        
        // Primary colors
        html += '<div class="color-section"><span class="color-label">Primary</span><div class="color-row">';
        colors.primary.forEach(color => {
            html += `<button class="color-swatch" data-color="${color}" style="background: ${color}" data-type="${type}"></button>`;
        });
        html += '</div></div>';
        
        // Accent colors
        html += '<div class="color-section"><span class="color-label">Accent</span><div class="color-row">';
        colors.accent.forEach(color => {
            html += `<button class="color-swatch" data-color="${color}" style="background: ${color}" data-type="${type}"></button>`;
        });
        html += '</div></div>';
        
        // Neutral colors
        html += '<div class="color-section"><span class="color-label">Neutral</span><div class="color-row">';
        colors.neutral.forEach(color => {
            html += `<button class="color-swatch" data-color="${color}" style="background: ${color}; border: 1px solid #ccc" data-type="${type}"></button>`;
        });
        html += '</div></div>';
        
        // Custom color input
        html += `
            <div class="color-section">
                <span class="color-label">Custom</span>
                <input type="color" class="custom-color-input" data-type="${type}" value="#0E7C86">
            </div>
        `;
        
        html += '</div>';
        return html;
    }
    
    // Create sidebar
    createSidebar() {
        this.sidebar.innerHTML = `
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Block
                </h3>
                <div class="block-inserter">
                    <div class="block-category">
                        <span class="category-label">Text</span>
                        <div class="block-buttons">
                            ${this.createBlockButton('paragraph')}
                            ${this.createBlockButton('heading')}
                            ${this.createBlockButton('quote')}
                            ${this.createBlockButton('code')}
                            ${this.createBlockButton('list')}
                            ${this.createBlockButton('callout')}
                        </div>
                    </div>
                    <div class="block-category">
                        <span class="category-label">Media</span>
                        <div class="block-buttons">
                            ${this.createBlockButton('image')}
                            ${this.createBlockButton('video')}
                            ${this.createBlockButton('gallery')}
                            ${this.createBlockButton('embed')}
                        </div>
                    </div>
                    <div class="block-category">
                        <span class="category-label">Layout</span>
                        <div class="block-buttons">
                            ${this.createBlockButton('divider')}
                            ${this.createBlockButton('spacer')}
                            ${this.createBlockButton('columns')}
                        </div>
                    </div>
                    <div class="block-category">
                        <span class="category-label">Interactive</span>
                        <div class="block-buttons">
                            ${this.createBlockButton('button')}
                            ${this.createBlockButton('table')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path>
                    </svg>
                    Sections
                </h3>
                <div class="sections-list" id="sections-list">
                    <!-- Sections will be listed here -->
                </div>
                <button class="btn btn-outline btn-sm btn-block add-section-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Section
                </button>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Media Library
                </h3>
                <div class="media-library" id="media-library">
                    <div class="upload-zone" id="upload-zone">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p>Drop files here or click to upload</p>
                        <input type="file" id="file-input" multiple accept="image/*,video/*,.pdf,.doc,.docx">
                    </div>
                    <div class="media-grid" id="media-grid">
                        <!-- Media items will appear here -->
                    </div>
                </div>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    History
                </h3>
                <div class="history-list" id="history-list">
                    <p class="empty-state">No history yet</p>
                </div>
            </div>
        `;
    }
    
    // Create block button
    createBlockButton(type) {
        const block = this.options.blockTypes[type];
        return `
            <button class="block-btn" data-block-type="${type}" title="${block.name}">
                <span class="block-icon">${block.icon}</span>
                <span class="block-label">${block.name}</span>
            </button>
        `;
    }
    
    // Create editor area
    createEditorArea() {
        this.editorArea.innerHTML = `
            <div class="editor-wrapper">
                <div class="blocks-container" id="blocks-container">
                    <div class="empty-editor">
                        <div class="empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <h3>Start Building Your Content</h3>
                        <p>Add blocks from the sidebar or click the + button below</p>
                        <button class="btn btn-primary add-first-block">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Your First Block
                        </button>
                    </div>
                </div>
                <button class="add-block-btn" id="add-block-btn" title="Add Block">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        `;
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Toolbar actions
        this.toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (btn) {
                this.handleToolbarAction(btn.dataset.action);
            }
            
            const formatBtn = e.target.closest('[data-format]');
            if (formatBtn) {
                this.applyFormat(formatBtn.dataset.format);
            }
            
            // Dropdown toggles
            const dropdownToggle = e.target.closest('.dropdown-toggle');
            if (dropdownToggle) {
                e.stopPropagation();
                this.toggleDropdown(dropdownToggle.dataset.dropdown);
            }
        });
        
        // Dropdown items
        this.toolbar.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (item) {
                this.handleDropdownSelect(item);
            }
            
            const colorSwatch = e.target.closest('.color-swatch');
            if (colorSwatch) {
                this.applyColor(colorSwatch.dataset.color, colorSwatch.dataset.type);
            }
        });
        
        // Custom color input
        this.toolbar.querySelectorAll('.custom-color-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.applyColor(e.target.value, e.target.dataset.type);
            });
        });
        
        // Block buttons in sidebar
        this.sidebar.addEventListener('click', (e) => {
            const blockBtn = e.target.closest('[data-block-type]');
            if (blockBtn) {
                this.addBlock(blockBtn.dataset.blockType);
            }
        });
        
        // Add first block button
        this.editorArea.querySelector('.add-first-block')?.addEventListener('click', () => {
            this.showBlockPicker();
        });
        
        // Add block button
        this.editorArea.querySelector('#add-block-btn')?.addEventListener('click', () => {
            this.showBlockPicker();
        });
        
        // File upload
        this.setupFileUpload();
        
        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Editor area clicks
        this.editorArea.addEventListener('click', (e) => {
            const block = e.target.closest('.editor-block');
            if (block) {
                this.selectBlock(block.dataset.blockId);
            }
        });
    }
    
    // Handle toolbar actions
    handleToolbarAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'copy':
                this.copyBlock();
                break;
            case 'paste':
                this.pasteBlock();
                break;
            case 'delete-block':
                this.deleteSelectedBlock();
                break;
            case 'toggle-grid':
                this.toggleGrid();
                break;
            case 'preview':
                this.preview();
                break;
            case 'save':
                this.save();
                break;
        }
    }
    
    // Add new block
    addBlock(type, position = null) {
        const block = this.createBlock(type);
        
        if (position !== null) {
            this.state.blocks.splice(position, 0, block);
        } else {
            this.state.blocks.push(block);
        }
        
        this.saveHistory();
        this.renderBlocks();
        this.selectBlock(block.id);
        this.updateCounts();
        
        // Hide empty state
        const emptyState = this.editorArea.querySelector('.empty-editor');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        return block;
    }
    
    // Create block object
    createBlock(type) {
        const blockType = this.options.blockTypes[type];
        return {
            id: 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            type: type,
            content: JSON.parse(JSON.stringify(blockType.defaultContent)),
            styles: {
                marginTop: 0,
                marginBottom: 16,
                marginLeft: 0,
                marginRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor: '',
                backgroundImage: '',
                borderRadius: 0,
                boxShadow: '',
                border: ''
            },
            animation: null,
            effects: [],
            visibility: {
                desktop: true,
                tablet: true,
                mobile: true
            },
            customClasses: [],
            customId: '',
            customAttributes: {}
        };
    }
    
    // Render all blocks
    renderBlocks() {
        const container = this.editorArea.querySelector('#blocks-container');
        
        if (this.state.blocks.length === 0) {
            container.innerHTML = `
                <div class="empty-editor">
                    <div class="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <h3>Start Building Your Content</h3>
                    <p>Add blocks from the sidebar or click the + button below</p>
                    <button class="btn btn-primary add-first-block">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Your First Block
                    </button>
                </div>
            `;
            
            container.querySelector('.add-first-block')?.addEventListener('click', () => {
                this.showBlockPicker();
            });
            
            return;
        }
        
        container.innerHTML = this.state.blocks.map((block, index) => this.renderBlock(block, index)).join('');
        
        // Add block controls
        container.querySelectorAll('.editor-block').forEach(blockEl => {
            const blockId = blockEl.dataset.blockId;
            
            // Drag handle
            blockEl.querySelector('.drag-handle')?.addEventListener('mousedown', (e) => {
                this.startDrag(e, blockId);
            });
            
            // Block actions
            blockEl.querySelector('.block-action-duplicate')?.addEventListener('click', () => {
                this.duplicateBlock(blockId);
            });
            
            blockEl.querySelector('.block-action-delete')?.addEventListener('click', () => {
                this.deleteBlock(blockId);
            });
            
            blockEl.querySelector('.block-action-move-up')?.addEventListener('click', () => {
                this.moveBlock(blockId, -1);
            });
            
            blockEl.querySelector('.block-action-move-down')?.addEventListener('click', () => {
                this.moveBlock(blockId, 1);
            });
        });
    }
    
    // Render individual block
    renderBlock(block, index) {
        const blockType = this.options.blockTypes[block.type];
        const isSelected = this.state.selectedBlock === block.id;
        
        let contentHtml = '';
        
        switch (block.type) {
            case 'paragraph':
                contentHtml = `<div class="block-content paragraph-content" contenteditable="true" placeholder="Type your paragraph...">${block.content || ''}</div>`;
                break;
                
            case 'heading':
                const level = block.content.level || 2;
                contentHtml = `
                    <div class="block-content heading-content">
                        <select class="heading-level-select">
                            ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}" ${l === level ? 'selected' : ''}>H${l}</option>`).join('')}
                        </select>
                        <h${level} contenteditable="true" placeholder="Type your heading...">${block.content.text || ''}</h${level}>
                    </div>
                `;
                break;
                
            case 'image':
                contentHtml = `
                    <div class="block-content image-content">
                        ${block.content.url ? 
                            `<img src="${block.content.url}" alt="${block.content.alt || ''}" class="block-image">
                             ${block.content.caption ? `<figcaption>${block.content.caption}</figcaption>` : ''}` :
                            `<div class="image-placeholder" data-block-id="${block.id}">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <p>Click to add image</p>
                            </div>`
                        }
                        <div class="image-controls">
                            <input type="text" class="image-url-input" placeholder="Image URL" value="${block.content.url || ''}">
                            <input type="text" class="image-alt-input" placeholder="Alt text" value="${block.content.alt || ''}">
                            <input type="text" class="image-caption-input" placeholder="Caption" value="${block.content.caption || ''}">
                        </div>
                    </div>
                `;
                break;
                
            case 'video':
                contentHtml = `
                    <div class="block-content video-content">
                        ${block.content.url ? 
                            `<div class="video-wrapper">${this.getVideoEmbed(block.content.url, block.content.type)}</div>` :
                            `<div class="video-placeholder">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                <p>Enter video URL</p>
                            </div>`
                        }
                        <div class="video-controls">
                            <input type="text" class="video-url-input" placeholder="YouTube or Vimeo URL" value="${block.content.url || ''}">
                        </div>
                    </div>
                `;
                break;
                
            case 'quote':
                contentHtml = `
                    <div class="block-content quote-content">
                        <blockquote contenteditable="true" placeholder="Quote text...">${block.content.text || ''}</blockquote>
                        <cite contenteditable="true" placeholder="Author...">${block.content.author || ''}</cite>
                    </div>
                `;
                break;
                
            case 'code':
                contentHtml = `
                    <div class="block-content code-content">
                        <select class="code-language-select">
                            <option value="javascript" ${block.content.language === 'javascript' ? 'selected' : ''}>JavaScript</option>
                            <option value="python" ${block.content.language === 'python' ? 'selected' : ''}>Python</option>
                            <option value="html" ${block.content.language === 'html' ? 'selected' : ''}>HTML</option>
                            <option value="css" ${block.content.language === 'css' ? 'selected' : ''}>CSS</option>
                            <option value="sql" ${block.content.language === 'sql' ? 'selected' : ''}>SQL</option>
                        </select>
                        <pre><code contenteditable="true" placeholder="Your code...">${block.content.code || ''}</code></pre>
                    </div>
                `;
                break;
                
            case 'divider':
                contentHtml = `
                    <div class="block-content divider-content">
                        <hr class="divider divider-${block.content.style || 'solid'}">
                    </div>
                `;
                break;
                
            case 'spacer':
                contentHtml = `
                    <div class="block-content spacer-content" style="height: ${block.content.height || 40}px">
                        <div class="spacer-indicator"></div>
                    </div>
                `;
                break;
                
            case 'button':
                contentHtml = `
                    <div class="block-content button-content">
                        <a href="${block.content.url || '#'}" class="btn btn-${block.content.style || 'primary'}" contenteditable="true">${block.content.text || 'Click Here'}</a>
                        <div class="button-controls">
                            <input type="text" class="button-url-input" placeholder="Button URL" value="${block.content.url || ''}">
                            <select class="button-style-select">
                                <option value="primary" ${block.content.style === 'primary' ? 'selected' : ''}>Primary</option>
                                <option value="outline" ${block.content.style === 'outline' ? 'selected' : ''}>Outline</option>
                                <option value="ghost" ${block.content.style === 'ghost' ? 'selected' : ''}>Ghost</option>
                            </select>
                        </div>
                    </div>
                `;
                break;
                
            case 'callout':
                contentHtml = `
                    <div class="block-content callout-content callout-${block.content.type || 'info'}">
                        <div class="callout-icon">${block.content.type === 'warning' ? '⚠️' : block.content.type === 'error' ? '❌' : block.content.type === 'success' ? '✅' : 'ℹ️'}</div>
                        <div class="callout-text" contenteditable="true" placeholder="Callout text...">${block.content.text || ''}</div>
                        <select class="callout-type-select">
                            <option value="info" ${block.content.type === 'info' ? 'selected' : ''}>Info</option>
                            <option value="warning" ${block.content.type === 'warning' ? 'selected' : ''}>Warning</option>
                            <option value="error" ${block.content.type === 'error' ? 'selected' : ''}>Error</option>
                            <option value="success" ${block.content.type === 'success' ? 'selected' : ''}>Success</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'gallery':
                contentHtml = `
                    <div class="block-content gallery-content">
                        <div class="gallery-grid gallery-${block.content.layout || 'grid'}">
                            ${(block.content.images || []).map(img => `
                                <div class="gallery-item">
                                    <img src="${img.url}" alt="${img.alt || ''}">
                                </div>
                            `).join('')}
                            <div class="gallery-add-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'list':
                contentHtml = `
                    <div class="block-content list-content">
                        <${block.content.type === 'ordered' ? 'ol' : 'ul'} class="block-list">
                            ${(block.content.items || ['List item']).map(item => `<li contenteditable="true">${item}</li>`).join('')}
                        </${block.content.type === 'ordered' ? 'ol' : 'ul'}>
                    </div>
                `;
                break;
                
            case 'columns':
                contentHtml = `
                    <div class="block-content columns-content" style="--columns: ${block.content.columns || 2}; --gap: ${block.content.gap || 20}px">
                        ${Array(block.content.columns || 2).fill(0).map((_, i) => `
                            <div class="column" data-col="${i}">
                                <div class="column-content" contenteditable="true" placeholder="Column ${i + 1} content...">${block.content.columnContents?.[i] || ''}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            default:
                contentHtml = `<div class="block-content" contenteditable="true">${JSON.stringify(block.content)}</div>`;
        }
        
        const animationClass = block.animation ? `animated ${block.animation}` : '';
        const effectClasses = block.effects?.join(' ') || '';
        
        return `
            <div class="editor-block ${isSelected ? 'selected' : ''} ${animationClass} ${effectClasses}" 
                 data-block-id="${block.id}" 
                 data-block-type="${block.type}"
                 style="${this.getBlockStyles(block)}">
                <div class="block-controls">
                    <div class="drag-handle" title="Drag to reorder">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="5" r="1"></circle>
                            <circle cx="9" cy="12" r="1"></circle>
                            <circle cx="9" cy="19" r="1"></circle>
                            <circle cx="15" cy="5" r="1"></circle>
                            <circle cx="15" cy="12" r="1"></circle>
                            <circle cx="15" cy="19" r="1"></circle>
                        </svg>
                    </div>
                    <span class="block-type-label">${blockType.icon} ${blockType.name}</span>
                    <div class="block-actions">
                        <button class="block-action block-action-move-up" title="Move Up">↑</button>
                        <button class="block-action block-action-move-down" title="Move Down">↓</button>
                        <button class="block-action block-action-duplicate" title="Duplicate">📄</button>
                        <button class="block-action block-action-delete" title="Delete">🗑️</button>
                    </div>
                </div>
                ${contentHtml}
            </div>
        `;
    }
    
    // Get block inline styles
    getBlockStyles(block) {
        const s = block.styles || {};
        let styles = [];
        
        if (s.marginTop) styles.push(`margin-top: ${s.marginTop}px`);
        if (s.marginBottom) styles.push(`margin-bottom: ${s.marginBottom}px`);
        if (s.paddingTop) styles.push(`padding-top: ${s.paddingTop}px`);
        if (s.paddingBottom) styles.push(`padding-bottom: ${s.paddingBottom}px`);
        if (s.paddingLeft) styles.push(`padding-left: ${s.paddingLeft}px`);
        if (s.paddingRight) styles.push(`padding-right: ${s.paddingRight}px`);
        if (s.backgroundColor) styles.push(`background-color: ${s.backgroundColor}`);
        if (s.backgroundImage) styles.push(`background-image: url(${s.backgroundImage})`);
        if (s.borderRadius) styles.push(`border-radius: ${s.borderRadius}px`);
        if (s.boxShadow) styles.push(`box-shadow: ${s.boxShadow}`);
        if (s.border) styles.push(`border: ${s.border}`);
        
        return styles.join('; ');
    }
    
    // Select block
    selectBlock(blockId) {
        this.state.selectedBlock = blockId;
        
        // Update UI
        this.editorArea.querySelectorAll('.editor-block').forEach(el => {
            el.classList.toggle('selected', el.dataset.blockId === blockId);
        });
        
        // Show properties panel
        this.showBlockProperties(blockId);
    }
    
    // Show block properties panel
    showBlockProperties(blockId) {
        const block = this.state.blocks.find(b => b.id === blockId);
        if (!block) return;
        
        this.properties.innerHTML = `
            <div class="properties-panel">
                <h3 class="properties-title">Block Properties</h3>
                
                <div class="property-group">
                    <label>Spacing</label>
                    <div class="property-row">
                        <div class="property-field">
                            <span>Margin Top</span>
                            <input type="number" data-property="marginTop" value="${block.styles.marginTop || 0}" min="0">
                        </div>
                        <div class="property-field">
                            <span>Margin Bottom</span>
                            <input type="number" data-property="marginBottom" value="${block.styles.marginBottom || 16}" min="0">
                        </div>
                    </div>
                    <div class="property-row">
                        <div class="property-field">
                            <span>Padding Top</span>
                            <input type="number" data-property="paddingTop" value="${block.styles.paddingTop || 0}" min="0">
                        </div>
                        <div class="property-field">
                            <span>Padding Bottom</span>
                            <input type="number" data-property="paddingBottom" value="${block.styles.paddingBottom || 0}" min="0">
                        </div>
                    </div>
                </div>
                
                <div class="property-group">
                    <label>Background</label>
                    <div class="property-field">
                        <span>Color</span>
                        <input type="color" data-property="backgroundColor" value="${block.styles.backgroundColor || '#ffffff'}">
                    </div>
                    <div class="property-field">
                        <span>Image URL</span>
                        <input type="text" data-property="backgroundImage" value="${block.styles.backgroundImage || ''}" placeholder="Image URL">
                    </div>
                </div>
                
                <div class="property-group">
                    <label>Border</label>
                    <div class="property-row">
                        <div class="property-field">
                            <span>Radius</span>
                            <input type="number" data-property="borderRadius" value="${block.styles.borderRadius || 0}" min="0">
                        </div>
                    </div>
                    <div class="property-field">
                        <span>Border</span>
                        <input type="text" data-property="border" value="${block.styles.border || ''}" placeholder="1px solid #ccc">
                    </div>
                </div>
                
                <div class="property-group">
                    <label>Animation</label>
                    <select data-property="animation" class="property-select">
                        <option value="">None</option>
                        ${Object.entries(this.options.animations).map(([key, anim]) => 
                            `<option value="${key}" ${block.animation === key ? 'selected' : ''}>${anim.name}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="property-group">
                    <label>Visibility</label>
                    <div class="visibility-toggles">
                        <label class="toggle-label">
                            <input type="checkbox" data-visibility="desktop" ${block.visibility.desktop ? 'checked' : ''}>
                            <span>🖥️ Desktop</span>
                        </label>
                        <label class="toggle-label">
                            <input type="checkbox" data-visibility="tablet" ${block.visibility.tablet ? 'checked' : ''}>
                            <span>📱 Tablet</span>
                        </label>
                        <label class="toggle-label">
                            <input type="checkbox" data-visibility="mobile" ${block.visibility.mobile ? 'checked' : ''}>
                            <span>📲 Mobile</span>
                        </label>
                    </div>
                </div>
                
                <div class="property-group">
                    <label>Custom CSS Class</label>
                    <input type="text" data-property="customClass" value="${block.customClasses?.join(' ') || ''}" placeholder="class1 class2">
                </div>
                
                <div class="property-group">
                    <label>Custom ID</label>
                    <input type="text" data-property="customId" value="${block.customId || ''}" placeholder="my-block-id">
                </div>
            </div>
        `;
        
        // Setup property change listeners
        this.properties.querySelectorAll('[data-property]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateBlockProperty(blockId, e.target.dataset.property, e.target.value);
            });
        });
        
        // Visibility toggles
        this.properties.querySelectorAll('[data-visibility]').forEach(input => {
            input.addEventListener('change', (e) => {
                block.visibility[e.target.dataset.visibility] = e.target.checked;
                this.saveHistory();
            });
        });
    }
    
    // Update block property
    updateBlockProperty(blockId, property, value) {
        const block = this.state.blocks.find(b => b.id === blockId);
        if (!block) return;
        
        if (property === 'animation') {
            block.animation = value || null;
        } else if (property === 'customClass') {
            block.customClasses = value ? value.split(' ').filter(c => c) : [];
        } else if (property === 'customId') {
            block.customId = value;
        } else {
            // Parse numeric values
            if (!isNaN(value) && value !== '') {
                value = parseFloat(value);
            }
            block.styles[property] = value;
        }
        
        this.saveHistory();
        this.renderBlocks();
        this.selectBlock(blockId);
    }
    
    // Delete block
    deleteBlock(blockId) {
        const index = this.state.blocks.findIndex(b => b.id === blockId);
        if (index > -1) {
            this.state.blocks.splice(index, 1);
            this.saveHistory();
            this.renderBlocks();
            this.updateCounts();
            
            if (this.state.selectedBlock === blockId) {
                this.state.selectedBlock = null;
                this.properties.innerHTML = '<div class="empty-properties"><p>Select a block to edit its properties</p></div>';
            }
        }
    }
    
    // Delete selected block
    deleteSelectedBlock() {
        if (this.state.selectedBlock) {
            this.deleteBlock(this.state.selectedBlock);
        }
    }
    
    // Duplicate block
    duplicateBlock(blockId) {
        const index = this.state.blocks.findIndex(b => b.id === blockId);
        if (index > -1) {
            const original = this.state.blocks[index];
            const duplicate = JSON.parse(JSON.stringify(original));
            duplicate.id = 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            this.state.blocks.splice(index + 1, 0, duplicate);
            this.saveHistory();
            this.renderBlocks();
            this.selectBlock(duplicate.id);
            this.updateCounts();
        }
    }
    
    // Move block
    moveBlock(blockId, direction) {
        const index = this.state.blocks.findIndex(b => b.id === blockId);
        const newIndex = index + direction;
        
        if (newIndex >= 0 && newIndex < this.state.blocks.length) {
            const block = this.state.blocks.splice(index, 1)[0];
            this.state.blocks.splice(newIndex, 0, block);
            this.saveHistory();
            this.renderBlocks();
            this.selectBlock(blockId);
        }
    }
    
    // Copy block
    copyBlock() {
        if (this.state.selectedBlock) {
            const block = this.state.blocks.find(b => b.id === this.state.selectedBlock);
            if (block) {
                this.state.clipboard = JSON.parse(JSON.stringify(block));
                showToast('Block copied to clipboard', 'success');
            }
        }
    }
    
    // Paste block
    pasteBlock() {
        if (this.state.clipboard) {
            const block = JSON.parse(JSON.stringify(this.state.clipboard));
            block.id = 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            const index = this.state.selectedBlock ? 
                this.state.blocks.findIndex(b => b.id === this.state.selectedBlock) + 1 : 
                this.state.blocks.length;
            
            this.state.blocks.splice(index, 0, block);
            this.saveHistory();
            this.renderBlocks();
            this.selectBlock(block.id);
            this.updateCounts();
            showToast('Block pasted', 'success');
        }
    }
    
    // Undo
    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            this.state.blocks = JSON.parse(JSON.stringify(this.state.history[this.state.historyIndex]));
            this.renderBlocks();
            this.updateCounts();
        }
    }
    
    // Redo
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            this.state.blocks = JSON.parse(JSON.stringify(this.state.history[this.state.historyIndex]));
            this.renderBlocks();
            this.updateCounts();
        }
    }
    
    // Save to history
    saveHistory() {
        // Remove future history if we're not at the end
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        }
        
        // Add current state to history
        this.state.history.push(JSON.parse(JSON.stringify(this.state.blocks)));
        this.state.historyIndex = this.state.history.length - 1;
        
        // Limit history size
        if (this.state.history.length > this.state.maxHistory) {
            this.state.history.shift();
            this.state.historyIndex--;
        }
        
        this.updateHistoryPanel();
    }
    
    // Update history panel
    updateHistoryPanel() {
        const historyList = this.sidebar.querySelector('#history-list');
        if (historyList) {
            historyList.innerHTML = this.state.history.slice(-10).reverse().map((_, index) => `
                <div class="history-item ${index === this.state.history.length - 1 - this.state.historyIndex ? 'active' : ''}" 
                     data-history-index="${this.state.history.length - 1 - index}">
                    <span class="history-time">${new Date().toLocaleTimeString()}</span>
                    <span class="history-blocks">${this.state.history[this.state.history.length - 1 - index].length} blocks</span>
                </div>
            `).join('');
        }
    }
    
    // Apply text format
    applyFormat(format) {
        document.execCommand(format, false, null);
    }
    
    // Apply color
    applyColor(color, type) {
        if (type === 'text-color') {
            document.execCommand('foreColor', false, color);
        } else {
            document.execCommand('hiliteColor', false, color);
        }
        this.closeAllDropdowns();
    }
    
    // Handle dropdown selection
    handleDropdownSelect(item) {
        if (item.dataset.font) {
            document.execCommand('fontName', false, item.dataset.font);
        } else if (item.dataset.size) {
            // Font size requires custom implementation
            document.execCommand('fontSize', false, '7'); // Largest size
            const fontElements = document.querySelectorAll('font[size="7"]');
            fontElements.forEach(el => {
                el.removeAttribute('size');
                el.style.fontSize = item.dataset.size;
            });
        } else if (item.dataset.effect) {
            this.applyTextEffect(item.dataset.effect);
        } else if (item.dataset.animation) {
            if (this.state.selectedBlock) {
                this.updateBlockProperty(this.state.selectedBlock, 'animation', item.dataset.animation);
            }
        }
        this.closeAllDropdowns();
    }
    
    // Apply text effect
    applyTextEffect(effect) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.className = `text-effect effect-${effect}`;
            span.style.cssText = this.options.textEffects[effect].css;
            range.surroundContents(span);
        }
    }
    
    // Toggle dropdown
    toggleDropdown(dropdownId) {
        this.closeAllDropdowns();
        const menu = this.toolbar.querySelector(`#${dropdownId}-menu`);
        if (menu) {
            menu.classList.toggle('show');
        }
    }
    
    // Close all dropdowns
    closeAllDropdowns() {
        this.toolbar.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
    
    // Show block picker
    showBlockPicker() {
        // For now, default to paragraph
        this.addBlock('paragraph');
    }
    
    // Toggle grid
    toggleGrid() {
        this.state.settings.showGridLines = !this.state.settings.showGridLines;
        this.editorArea.classList.toggle('show-grid', this.state.settings.showGridLines);
    }
    
    // Preview
    preview() {
        const previewContent = this.generateHTML();
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview</title>
                <link rel="stylesheet" href="css/style.css">
                <link rel="stylesheet" href="css/block-editor.css">
                <style>
                    body { padding: 40px; max-width: 1200px; margin: 0 auto; }
                </style>
            </head>
            <body>
                ${previewContent}
            </body>
            </html>
        `);
    }
    
    // Save
    save() {
        const content = {
            blocks: this.state.blocks,
            sections: this.state.sections,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('blockEditor_content', JSON.stringify(content));
        
        // Also save to the main content system
        if (typeof AdminState !== 'undefined') {
            AdminState.content.blockEditor = content;
            saveContent();
        }
        
        // Update status
        const lastSaved = this.container.querySelector('.last-saved strong');
        if (lastSaved) {
            lastSaved.textContent = new Date().toLocaleTimeString();
        }
        
        showToast('Content saved successfully!', 'success');
    }
    
    // Load saved content
    loadSavedContent() {
        const saved = localStorage.getItem('blockEditor_content');
        if (saved) {
            try {
                const content = JSON.parse(saved);
                this.state.blocks = content.blocks || [];
                this.state.sections = content.sections || [];
                this.renderBlocks();
                this.updateCounts();
            } catch (e) {
                console.error('Error loading saved content:', e);
            }
        }
    }
    
    // Start auto-save
    startAutoSave() {
        setInterval(() => {
            if (this.state.settings.autoSave) {
                this.save();
            }
        }, this.state.settings.autoSaveInterval);
    }
    
    // Setup file upload
    setupFileUpload() {
        const uploadZone = this.sidebar.querySelector('#upload-zone');
        const fileInput = this.sidebar.querySelector('#file-input');
        
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
    }
    
    // Handle uploaded files
    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.uploadImage(file);
            } else if (file.type.startsWith('video/')) {
                this.uploadVideo(file);
            }
        });
    }
    
    // Upload image
    uploadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaItem = {
                id: 'media-' + Date.now(),
                type: 'image',
                url: e.target.result,
                name: file.name,
                size: file.size,
                uploadedAt: new Date().toISOString()
            };
            
            this.state.media.images.push(mediaItem);
            this.renderMediaLibrary();
            showToast('Image uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
    
    // Upload video
    uploadVideo(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaItem = {
                id: 'media-' + Date.now(),
                type: 'video',
                url: e.target.result,
                name: file.name,
                size: file.size,
                uploadedAt: new Date().toISOString()
            };
            
            this.state.media.videos.push(mediaItem);
            this.renderMediaLibrary();
            showToast('Video uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
    
    // Render media library
    renderMediaLibrary() {
        const mediaGrid = this.sidebar.querySelector('#media-grid');
        if (mediaGrid) {
            const allMedia = [...this.state.media.images, ...this.state.media.videos];
            mediaGrid.innerHTML = allMedia.map(item => `
                <div class="media-item" data-media-id="${item.id}">
                    ${item.type === 'image' ? 
                        `<img src="${item.url}" alt="${item.name}">` :
                        `<video src="${item.url}"></video>`
                    }
                </div>
            `).join('');
        }
    }
    
    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    this.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 'c':
                    if (this.state.selectedBlock) {
                        e.preventDefault();
                        this.copyBlock();
                    }
                    break;
                case 'v':
                    if (this.state.clipboard) {
                        e.preventDefault();
                        this.pasteBlock();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    this.save();
                    break;
            }
        }
        
        // Delete key
        if (e.key === 'Delete' && this.state.selectedBlock) {
            this.deleteSelectedBlock();
        }
    }
    
    // Update counts
    updateCounts() {
        const blockCount = this.container.querySelector('.block-count strong');
        const wordCount = this.container.querySelector('.word-count strong');
        
        if (blockCount) {
            blockCount.textContent = this.state.blocks.length;
        }
        
        if (wordCount) {
            const text = this.state.blocks.map(b => {
                if (typeof b.content === 'string') return b.content;
                if (b.content.text) return b.content.text;
                return '';
            }).join(' ');
            wordCount.textContent = text.split(/\s+/).filter(w => w).length;
        }
    }
    
    // Get video embed HTML
    getVideoEmbed(url, type) {
        if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
            return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        } else if (type === 'vimeo' || url.includes('vimeo.com')) {
            const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
            return `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
        return `<video src="${url}" controls></video>`;
    }
    
    // Generate HTML for output
    generateHTML() {
        return this.state.blocks.map(block => this.blockToHTML(block)).join('\n');
    }
    
    // Convert block to HTML
    blockToHTML(block) {
        const visibilityClass = Object.entries(block.visibility)
            .filter(([_, visible]) => !visible)
            .map(([device]) => `hide-on-${device}`)
            .join(' ');
        
        const customClasses = block.customClasses?.join(' ') || '';
        const className = `block block-${block.type} ${visibilityClass} ${customClasses}`.trim();
        const id = block.customId || '';
        
        let content = '';
        
        switch (block.type) {
            case 'paragraph':
                content = `<p>${block.content || ''}</p>`;
                break;
            case 'heading':
                const level = block.content.level || 2;
                content = `<h${level}>${block.content.text || ''}</h${level}>`;
                break;
            case 'image':
                content = `<figure class="image-block">
                    <img src="${block.content.url}" alt="${block.content.alt || ''}">
                    ${block.content.caption ? `<figcaption>${block.content.caption}</figcaption>` : ''}
                </figure>`;
                break;
            case 'video':
                content = `<div class="video-wrapper">${this.getVideoEmbed(block.content.url, block.content.type)}</div>`;
                break;
            case 'quote':
                content = `<blockquote>${block.content.text || ''}${block.content.author ? `<cite>${block.content.author}</cite>` : ''}</blockquote>`;
                break;
            case 'code':
                content = `<pre><code class="language-${block.content.language}">${block.content.code || ''}</code></pre>`;
                break;
            case 'divider':
                content = `<hr class="divider-${block.content.style || 'solid'}">`;
                break;
            case 'spacer':
                content = `<div class="spacer" style="height: ${block.content.height || 40}px"></div>`;
                break;
            case 'button':
                content = `<a href="${block.content.url || '#'}" class="btn btn-${block.content.style || 'primary'}">${block.content.text || 'Click Here'}</a>`;
                break;
            case 'callout':
                content = `<div class="callout callout-${block.content.type || 'info'}">${block.content.text || ''}</div>`;
                break;
            default:
                content = JSON.stringify(block.content);
        }
        
        const style = this.getBlockStyles(block);
        const animationAttr = block.animation ? `data-animation="${block.animation}"` : '';
        
        return `<div class="${className}" ${id ? `id="${id}"` : ''} ${style ? `style="${style}"` : ''} ${animationAttr}>${content}</div>`;
    }
    
    // Export content
    exportContent() {
        return {
            html: this.generateHTML(),
            blocks: this.state.blocks,
            sections: this.state.sections
        };
    }
    
    // Import content
    importContent(content) {
        if (content.blocks) {
            this.state.blocks = content.blocks;
            this.state.sections = content.sections || [];
            this.saveHistory();
            this.renderBlocks();
            this.updateCounts();
        }
    }
}

// Initialize block editor
let blockEditor = null;

function initBlockEditor(containerId = 'block-editor-container') {
    blockEditor = new BlockEditor(containerId);
    return blockEditor;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlockEditor, BlockEditorConfig, BlockEditorState, initBlockEditor };
}
