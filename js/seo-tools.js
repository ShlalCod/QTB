/**
 * SEO Tools Module
 * Professional SEO analysis and optimization tools
 * 
 * Features:
 * - Meta tag management
 * - Keyword analysis
 * - Content SEO score
 * - Schema markup generator
 * - Open Graph & Twitter Cards
 * - Sitemap generation
 * - Performance insights
 */

'use strict';

const SEOTools = {
    // SEO Configuration
    config: {
        maxTitleLength: 60,
        maxDescriptionLength: 160,
        minContentLength: 300,
        idealKeywordDensity: { min: 0.5, max: 2.5 },
        headingStructure: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    },
    
    // Current SEO data
    currentData: {
        title: '',
        description: '',
        keywords: [],
        url: '',
        content: '',
        images: [],
        headings: {}
    },
    
    // Initialize SEO Tools
    init() {
        this.createSEOPanel();
        this.loadCurrentData();
    },
    
    // Create SEO Panel UI
    createSEOPanel() {
        const seoSection = document.getElementById('section-seo');
        if (!seoSection) return;
        
        seoSection.innerHTML = `
            <div class="seo-panel">
                <div class="seo-header">
                    <h2>SEO Tools</h2>
                    <div class="seo-score-badge" id="seo-score-badge">
                        <span class="score-value">0</span>
                        <span class="score-label">SEO Score</span>
                    </div>
                </div>
                
                <!-- Meta Tags Section -->
                <div class="seo-section">
                    <h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Meta Tags
                    </h3>
                    
                    <div class="seo-field">
                        <label for="seo-title">Page Title</label>
                        <div class="input-wrapper">
                            <input type="text" id="seo-title" placeholder="Enter page title...">
                            <span class="char-count"><span id="title-count">0</span>/${this.config.maxTitleLength}</span>
                        </div>
                        <div class="field-hint" id="title-hint"></div>
                        <div class="google-preview">
                            <span class="preview-label">Google Preview:</span>
                            <div class="preview-title" id="preview-title">Your Page Title</div>
                            <div class="preview-url">https://yoursite.com/page-url</div>
                        </div>
                    </div>
                    
                    <div class="seo-field">
                        <label for="seo-description">Meta Description</label>
                        <div class="input-wrapper">
                            <textarea id="seo-description" rows="3" placeholder="Enter meta description..."></textarea>
                            <span class="char-count"><span id="desc-count">0</span>/${this.config.maxDescriptionLength}</span>
                        </div>
                        <div class="field-hint" id="desc-hint"></div>
                        <div class="google-preview">
                            <div class="preview-desc" id="preview-desc">Your meta description will appear here...</div>
                        </div>
                    </div>
                    
                    <div class="seo-field">
                        <label for="seo-keywords">Keywords (comma separated)</label>
                        <input type="text" id="seo-keywords" placeholder="keyword1, keyword2, keyword3">
                        <div class="keywords-list" id="keywords-list"></div>
                    </div>
                    
                    <div class="seo-field">
                        <label for="seo-url">URL Slug</label>
                        <div class="url-input-wrapper">
                            <span class="url-base">https://yoursite.com/</span>
                            <input type="text" id="seo-url" placeholder="page-url">
                        </div>
                    </div>
                </div>
                
                <!-- Open Graph Section -->
                <div class="seo-section">
                    <h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Social Media (Open Graph & Twitter)
                    </h3>
                    
                    <div class="seo-field">
                        <label for="og-title">OG Title</label>
                        <input type="text" id="og-title" placeholder="Title for social sharing">
                    </div>
                    
                    <div class="seo-field">
                        <label for="og-description">OG Description</label>
                        <textarea id="og-description" rows="2" placeholder="Description for social sharing"></textarea>
                    </div>
                    
                    <div class="seo-field">
                        <label for="og-image">OG Image URL</label>
                        <input type="url" id="og-image" placeholder="https://yoursite.com/image.jpg">
                        <div class="image-preview" id="og-image-preview"></div>
                    </div>
                    
                    <div class="seo-field">
                        <label for="og-type">OG Type</label>
                        <select id="og-type">
                            <option value="website">Website</option>
                            <option value="article">Article</option>
                            <option value="product">Product</option>
                            <option value="profile">Profile</option>
                        </select>
                    </div>
                    
                    <div class="social-preview">
                        <span class="preview-label">Facebook Preview:</span>
                        <div class="fb-preview" id="fb-preview">
                            <div class="fb-image"></div>
                            <div class="fb-content">
                                <div class="fb-url">yoursite.com</div>
                                <div class="fb-title">Your Title</div>
                                <div class="fb-desc">Your description</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Schema Markup Section -->
                <div class="seo-section">
                    <h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                        Schema Markup (Structured Data)
                    </h3>
                    
                    <div class="seo-field">
                        <label for="schema-type">Schema Type</label>
                        <select id="schema-type">
                            <option value="none">None</option>
                            <option value="WebSite">Website</option>
                            <option value="Article">Article</option>
                            <option value="Product">Product</option>
                            <option value="LocalBusiness">Local Business</option>
                            <option value="Person">Person</option>
                            <option value="Service">Service</option>
                            <option value="FAQPage">FAQ Page</option>
                        </select>
                    </div>
                    
                    <div id="schema-fields" class="schema-fields"></div>
                    
                    <div class="schema-output">
                        <label>Generated JSON-LD:</label>
                        <pre id="schema-output"><code></code></pre>
                        <button class="btn btn-sm btn-outline" onclick="SEOTools.copySchema()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                </div>
                
                <!-- Content Analysis Section -->
                <div class="seo-section">
                    <h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Content Analysis
                    </h3>
                    
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <span class="analysis-label">Word Count</span>
                            <span class="analysis-value" id="word-count">0</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Character Count</span>
                            <span class="analysis-value" id="char-count">0</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Sentences</span>
                            <span class="analysis-value" id="sentence-count">0</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Paragraphs</span>
                            <span class="analysis-value" id="paragraph-count">0</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Reading Time</span>
                            <span class="analysis-value" id="reading-time">0 min</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Keyword Density</span>
                            <span class="analysis-value" id="keyword-density">0%</span>
                        </div>
                    </div>
                    
                    <div class="heading-structure">
                        <h4>Heading Structure</h4>
                        <div id="heading-tree" class="heading-tree"></div>
                    </div>
                    
                    <div class="seo-checks" id="seo-checks">
                        <!-- SEO checks will be rendered here -->
                    </div>
                </div>
                
                <!-- Image SEO Section -->
                <div class="seo-section">
                    <h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        Image SEO
                    </h3>
                    
                    <div class="images-list" id="images-list">
                        <!-- Images will be listed here -->
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="seo-actions">
                    <button class="btn btn-outline" onclick="SEOTools.analyzeContent()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Analyze Content
                    </button>
                    <button class="btn btn-outline" onclick="SEOTools.generateMetaTags()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                        Generate Meta Tags
                    </button>
                    <button class="btn btn-primary" onclick="SEOTools.saveSEOSettings()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Save SEO Settings
                    </button>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Title input
        const titleInput = document.getElementById('seo-title');
        titleInput?.addEventListener('input', (e) => {
            this.updateTitlePreview(e.target.value);
            this.calculateScore();
        });
        
        // Description input
        const descInput = document.getElementById('seo-description');
        descInput?.addEventListener('input', (e) => {
            this.updateDescriptionPreview(e.target.value);
            this.calculateScore();
        });
        
        // Keywords input
        const keywordsInput = document.getElementById('seo-keywords');
        keywordsInput?.addEventListener('input', (e) => {
            this.updateKeywords(e.target.value);
        });
        
        // Schema type select
        const schemaSelect = document.getElementById('schema-type');
        schemaSelect?.addEventListener('change', (e) => {
            this.updateSchemaFields(e.target.value);
        });
        
        // OG image input
        const ogImage = document.getElementById('og-image');
        ogImage?.addEventListener('input', (e) => {
            this.updateOGImagePreview(e.target.value);
        });
    },
    
    // Load current data from content
    loadCurrentData() {
        if (typeof AdminState !== 'undefined' && AdminState.content) {
            const content = AdminState.content;
            
            // Load settings
            const titleInput = document.getElementById('seo-title');
            const descInput = document.getElementById('seo-description');
            const keywordsInput = document.getElementById('seo-keywords');
            
            if (content.settings) {
                if (titleInput && content.settings.siteTitle) {
                    titleInput.value = content.settings.siteTitle;
                    this.updateTitlePreview(content.settings.siteTitle);
                }
                if (descInput && content.settings.siteDescription) {
                    descInput.value = content.settings.siteDescription;
                    this.updateDescriptionPreview(content.settings.siteDescription);
                }
                if (keywordsInput && content.settings.siteKeywords) {
                    keywordsInput.value = content.settings.siteKeywords;
                    this.updateKeywords(content.settings.siteKeywords);
                }
            }
        }
        
        this.analyzeContent();
    },
    
    // Update title preview
    updateTitlePreview(title) {
        const count = document.getElementById('title-count');
        const preview = document.getElementById('preview-title');
        const hint = document.getElementById('title-hint');
        
        if (count) count.textContent = title.length;
        if (preview) preview.textContent = title || 'Your Page Title';
        
        if (hint) {
            if (title.length === 0) {
                hint.innerHTML = '<span class="hint-error">⚠️ Title is required</span>';
            } else if (title.length > this.config.maxTitleLength) {
                hint.innerHTML = '<span class="hint-warning">⚠️ Title is too long. Google may truncate it.</span>';
            } else if (title.length < 30) {
                hint.innerHTML = '<span class="hint-info">ℹ️ Consider making your title longer (30-60 characters)</span>';
            } else {
                hint.innerHTML = '<span class="hint-success">✓ Good title length</span>';
            }
        }
    },
    
    // Update description preview
    updateDescriptionPreview(desc) {
        const count = document.getElementById('desc-count');
        const preview = document.getElementById('preview-desc');
        const hint = document.getElementById('desc-hint');
        
        if (count) count.textContent = desc.length;
        if (preview) preview.textContent = desc || 'Your meta description will appear here...';
        
        if (hint) {
            if (desc.length === 0) {
                hint.innerHTML = '<span class="hint-error">⚠️ Description is recommended</span>';
            } else if (desc.length > this.config.maxDescriptionLength) {
                hint.innerHTML = '<span class="hint-warning">⚠️ Description is too long. Google may truncate it.</span>';
            } else if (desc.length < 120) {
                hint.innerHTML = '<span class="hint-info">ℹ️ Consider making your description longer (120-160 characters)</span>';
            } else {
                hint.innerHTML = '<span class="hint-success">✓ Good description length</span>';
            }
        }
    },
    
    // Update keywords
    updateKeywords(keywordsStr) {
        const keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k);
        this.currentData.keywords = keywords;
        
        const container = document.getElementById('keywords-list');
        if (container) {
            container.innerHTML = keywords.map(k => `
                <span class="keyword-tag">${escapeHtml(k)}</span>
            `).join('');
        }
    },
    
    // Update OG image preview
    updateOGImagePreview(url) {
        const preview = document.getElementById('og-image-preview');
        const fbPreview = document.querySelector('.fb-image');
        
        if (preview) {
            if (url) {
                preview.innerHTML = `<img src="${url}" alt="OG Image Preview" onerror="this.style.display='none'">`;
                if (fbPreview) fbPreview.style.backgroundImage = `url(${url})`;
            } else {
                preview.innerHTML = '';
                if (fbPreview) fbPreview.style.backgroundImage = '';
            }
        }
    },
    
    // Update schema fields based on type
    updateSchemaFields(type) {
        const container = document.getElementById('schema-fields');
        if (!container) return;
        
        const fields = this.getSchemaFields(type);
        container.innerHTML = fields.map(field => `
            <div class="seo-field">
                <label for="schema-${field.id}">${field.label}</label>
                ${field.type === 'textarea' ? 
                    `<textarea id="schema-${field.id}" rows="3" placeholder="${field.placeholder || ''}"></textarea>` :
                    field.type === 'select' ?
                    `<select id="schema-${field.id}">${field.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>` :
                    `<input type="${field.type || 'text'}" id="schema-${field.id}" placeholder="${field.placeholder || ''}">`
                }
            </div>
        `).join('');
        
        this.generateSchema();
    },
    
    // Get schema fields for type
    getSchemaFields(type) {
        const schemas = {
            WebSite: [
                { id: 'name', label: 'Website Name', type: 'text' },
                { id: 'url', label: 'Website URL', type: 'url' },
                { id: 'description', label: 'Description', type: 'textarea' }
            ],
            Article: [
                { id: 'headline', label: 'Headline', type: 'text' },
                { id: 'author', label: 'Author', type: 'text' },
                { id: 'datePublished', label: 'Publish Date', type: 'date' },
                { id: 'image', label: 'Image URL', type: 'url' }
            ],
            Product: [
                { id: 'name', label: 'Product Name', type: 'text' },
                { id: 'price', label: 'Price', type: 'number' },
                { id: 'currency', label: 'Currency', type: 'select', options: [
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'GBP', label: 'GBP' }
                ]},
                { id: 'availability', label: 'Availability', type: 'select', options: [
                    { value: 'InStock', label: 'In Stock' },
                    { value: 'OutOfStock', label: 'Out of Stock' }
                ]}
            ],
            LocalBusiness: [
                { id: 'name', label: 'Business Name', type: 'text' },
                { id: 'address', label: 'Address', type: 'text' },
                { id: 'telephone', label: 'Phone', type: 'tel' },
                { id: 'priceRange', label: 'Price Range', type: 'text', placeholder: '$ - $$$' }
            ],
            Person: [
                { id: 'name', label: 'Full Name', type: 'text' },
                { id: 'jobTitle', label: 'Job Title', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'image', label: 'Profile Image URL', type: 'url' }
            ],
            Service: [
                { id: 'name', label: 'Service Name', type: 'text' },
                { id: 'description', label: 'Description', type: 'textarea' },
                { id: 'provider', label: 'Provider Name', type: 'text' },
                { id: 'area', label: 'Service Area', type: 'text' }
            ],
            FAQPage: [
                { id: 'questions', label: 'Questions (JSON format)', type: 'textarea', placeholder: '[{"q": "Question?", "a": "Answer"}]' }
            ]
        };
        
        return schemas[type] || [];
    },
    
    // Generate schema JSON-LD
    generateSchema() {
        const type = document.getElementById('schema-type')?.value;
        if (!type || type === 'none') {
            this.updateSchemaOutput(null);
            return;
        }
        
        const schema = {
            '@context': 'https://schema.org',
            '@type': type
        };
        
        const fields = this.getSchemaFields(type);
        fields.forEach(field => {
            const input = document.getElementById(`schema-${field.id}`);
            if (input && input.value) {
                schema[field.id] = field.id === 'price' ? parseFloat(input.value) : input.value;
            }
        });
        
        this.updateSchemaOutput(schema);
    },
    
    // Update schema output display
    updateSchemaOutput(schema) {
        const output = document.querySelector('#schema-output code');
        if (output) {
            output.textContent = schema ? JSON.stringify(schema, null, 2) : 'Select a schema type to generate markup';
        }
    },
    
    // Copy schema to clipboard
    copySchema() {
        const output = document.querySelector('#schema-output code');
        if (output && output.textContent) {
            navigator.clipboard.writeText(output.textContent).then(() => {
                showToast('Schema copied to clipboard!', 'success');
            });
        }
    },
    
    // Analyze content
    analyzeContent() {
        // Get content from block editor or admin content
        let content = '';
        
        if (typeof blockEditor !== 'undefined' && blockEditor.state.blocks) {
            content = blockEditor.state.blocks.map(b => {
                if (typeof b.content === 'string') return b.content;
                if (b.content.text) return b.content.text;
                return '';
            }).join(' ');
        } else if (typeof AdminState !== 'undefined' && AdminState.content) {
            const c = AdminState.content;
            content = [
                c.hero?.title || '',
                c.hero?.subtitle || '',
                c.about?.description || '',
                ...(c.projects || []).map(p => p.description || ''),
                ...(c.experience || []).map(e => e.description || ''),
                ...(c.services || []).map(s => s.description || '')
            ].join(' ');
        }
        
        this.currentData.content = content;
        
        // Calculate stats
        const words = content.split(/\s+/).filter(w => w);
        const wordCount = words.length;
        const charCount = content.length;
        const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = content.split(/\n\n+/).filter(p => p.trim()).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        // Update UI
        document.getElementById('word-count').textContent = wordCount;
        document.getElementById('char-count').textContent = charCount;
        document.getElementById('sentence-count').textContent = sentences;
        document.getElementById('paragraph-count').textContent = paragraphs;
        document.getElementById('reading-time').textContent = `${readingTime} min`;
        
        // Calculate keyword density
        const keywords = this.currentData.keywords;
        if (keywords.length > 0 && wordCount > 0) {
            const mainKeyword = keywords[0].toLowerCase();
            const keywordCount = words.filter(w => w.toLowerCase().includes(mainKeyword)).length;
            const density = ((keywordCount / wordCount) * 100).toFixed(2);
            document.getElementById('keyword-density').textContent = `${density}%`;
        }
        
        // Analyze headings
        this.analyzeHeadings();
        
        // Analyze images
        this.analyzeImages();
        
        // Run SEO checks
        this.runSEOChecks(wordCount);
        
        // Calculate final score
        this.calculateScore();
    },
    
    // Analyze heading structure
    analyzeHeadings() {
        const container = document.getElementById('heading-tree');
        if (!container) return;
        
        // Extract headings from content
        const headings = [];
        
        if (typeof blockEditor !== 'undefined' && blockEditor.state.blocks) {
            blockEditor.state.blocks.forEach(block => {
                if (block.type === 'heading') {
                    headings.push({
                        level: block.content.level || 2,
                        text: block.content.text || ''
                    });
                }
            });
        } else if (typeof AdminState !== 'undefined' && AdminState.content) {
            // Add hero title as H1
            if (AdminState.content.hero?.title) {
                headings.push({ level: 1, text: AdminState.content.hero.title });
            }
            // Add about title as H2
            if (AdminState.content.about?.title) {
                headings.push({ level: 2, text: AdminState.content.about.title });
            }
        }
        
        container.innerHTML = headings.length > 0 ? headings.map(h => `
            <div class="heading-item heading-h${h.level}" style="padding-left: ${(h.level - 1) * 20}px">
                <span class="heading-tag">H${h.level}</span>
                <span class="heading-text">${escapeHtml(h.text.substring(0, 50))}${h.text.length > 50 ? '...' : ''}</span>
            </div>
        `).join('') : '<p class="empty-state">No headings found</p>';
        
        this.currentData.headings = headings;
    },
    
    // Analyze images
    analyzeImages() {
        const container = document.getElementById('images-list');
        if (!container) return;
        
        const images = [];
        
        // Extract images from content
        if (typeof blockEditor !== 'undefined' && blockEditor.state.blocks) {
            blockEditor.state.blocks.forEach(block => {
                if (block.type === 'image' && block.content.url) {
                    images.push({
                        url: block.content.url,
                        alt: block.content.alt || ''
                    });
                }
            });
        }
        
        container.innerHTML = images.length > 0 ? images.map((img, i) => `
            <div class="image-seo-item ${img.alt ? '' : 'missing-alt'}">
                <img src="${img.url}" alt="">
                <div class="image-seo-info">
                    <span class="image-url">${img.url.substring(0, 40)}...</span>
                    <span class="image-alt-status">
                        ${img.alt ? '✓ Has alt text' : '⚠️ Missing alt text'}
                    </span>
                </div>
            </div>
        `).join('') : '<p class="empty-state">No images found</p>';
        
        this.currentData.images = images;
    },
    
    // Run SEO checks
    runSEOChecks(wordCount) {
        const container = document.getElementById('seo-checks');
        if (!container) return;
        
        const checks = [];
        
        // Check title
        const title = document.getElementById('seo-title')?.value || '';
        checks.push({
            name: 'Title tag',
            status: title.length >= 30 && title.length <= 60 ? 'pass' : title.length > 0 ? 'warning' : 'fail',
            message: title.length === 0 ? 'Missing title tag' : 
                     title.length < 30 ? 'Title is too short' :
                     title.length > 60 ? 'Title is too long' : 'Title length is optimal'
        });
        
        // Check description
        const desc = document.getElementById('seo-description')?.value || '';
        checks.push({
            name: 'Meta description',
            status: desc.length >= 120 && desc.length <= 160 ? 'pass' : desc.length > 0 ? 'warning' : 'fail',
            message: desc.length === 0 ? 'Missing meta description' :
                     desc.length < 120 ? 'Description is too short' :
                     desc.length > 160 ? 'Description is too long' : 'Description length is optimal'
        });
        
        // Check word count
        checks.push({
            name: 'Content length',
            status: wordCount >= this.config.minContentLength ? 'pass' : 'warning',
            message: wordCount < this.config.minContentLength ? 
                `Content is too short (${wordCount} words). Aim for at least ${this.config.minContentLength} words.` :
                `Good content length (${wordCount} words)`
        });
        
        // Check H1
        const hasH1 = this.currentData.headings.some(h => h.level === 1);
        checks.push({
            name: 'H1 heading',
            status: hasH1 ? 'pass' : 'fail',
            message: hasH1 ? 'Page has H1 heading' : 'Missing H1 heading'
        });
        
        // Check images
        const missingAlt = this.currentData.images.filter(img => !img.alt).length;
        checks.push({
            name: 'Image alt text',
            status: this.currentData.images.length === 0 ? 'warning' : missingAlt === 0 ? 'pass' : 'fail',
            message: this.currentData.images.length === 0 ? 'No images found' :
                     missingAlt === 0 ? 'All images have alt text' :
                     `${missingAlt} image(s) missing alt text`
        });
        
        // Check keywords
        const keywords = this.currentData.keywords;
        checks.push({
            name: 'Keywords',
            status: keywords.length > 0 ? 'pass' : 'warning',
            message: keywords.length > 0 ? `${keywords.length} keywords defined` : 'No keywords defined'
        });
        
        container.innerHTML = checks.map(check => `
            <div class="seo-check seo-check-${check.status}">
                <span class="check-icon">${check.status === 'pass' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}</span>
                <div class="check-content">
                    <span class="check-name">${check.name}</span>
                    <span class="check-message">${check.message}</span>
                </div>
            </div>
        `).join('');
    },
    
    // Calculate SEO score
    calculateScore() {
        let score = 0;
        const maxScore = 100;
        
        // Title (20 points)
        const title = document.getElementById('seo-title')?.value || '';
        if (title.length >= 30 && title.length <= 60) score += 20;
        else if (title.length > 0) score += 10;
        
        // Description (20 points)
        const desc = document.getElementById('seo-description')?.value || '';
        if (desc.length >= 120 && desc.length <= 160) score += 20;
        else if (desc.length > 0) score += 10;
        
        // Content length (15 points)
        const wordCount = parseInt(document.getElementById('word-count')?.textContent || 0);
        if (wordCount >= this.config.minContentLength) score += 15;
        else if (wordCount > 0) score += Math.floor((wordCount / this.config.minContentLength) * 15);
        
        // H1 (15 points)
        const hasH1 = this.currentData.headings.some(h => h.level === 1);
        if (hasH1) score += 15;
        
        // Images with alt (15 points)
        const images = this.currentData.images;
        if (images.length > 0) {
            const withAlt = images.filter(img => img.alt).length;
            score += Math.floor((withAlt / images.length) * 15);
        } else {
            score += 5; // No images is okay
        }
        
        // Keywords (15 points)
        const keywords = this.currentData.keywords;
        if (keywords.length >= 3) score += 15;
        else if (keywords.length > 0) score += keywords.length * 5;
        
        // Update UI
        const badge = document.getElementById('seo-score-badge');
        const scoreValue = badge?.querySelector('.score-value');
        
        if (scoreValue) scoreValue.textContent = score;
        if (badge) {
            badge.className = 'seo-score-badge';
            if (score >= 80) badge.classList.add('score-excellent');
            else if (score >= 60) badge.classList.add('score-good');
            else if (score >= 40) badge.classList.add('score-fair');
            else badge.classList.add('score-poor');
        }
    },
    
    // Generate meta tags HTML
    generateMetaTags() {
        const title = document.getElementById('seo-title')?.value || '';
        const desc = document.getElementById('seo-description')?.value || '';
        const keywords = document.getElementById('seo-keywords')?.value || '';
        const ogTitle = document.getElementById('og-title')?.value || title;
        const ogDesc = document.getElementById('og-description')?.value || desc;
        const ogImage = document.getElementById('og-image')?.value || '';
        const ogType = document.getElementById('og-type')?.value || 'website';
        
        const tags = [];
        
        // Basic meta tags
        if (title) tags.push(`<title>${escapeHtml(title)}</title>`);
        if (desc) tags.push(`<meta name="description" content="${escapeHtml(desc)}">`);
        if (keywords) tags.push(`<meta name="keywords" content="${escapeHtml(keywords)}">`);
        
        // Open Graph tags
        if (ogTitle) tags.push(`<meta property="og:title" content="${escapeHtml(ogTitle)}">`);
        if (ogDesc) tags.push(`<meta property="og:description" content="${escapeHtml(ogDesc)}">`);
        if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}">`);
        tags.push(`<meta property="og:type" content="${ogType}">`);
        
        // Twitter Card tags
        tags.push(`<meta name="twitter:card" content="summary_large_image">`);
        if (ogTitle) tags.push(`<meta name="twitter:title" content="${escapeHtml(ogTitle)}">`);
        if (ogDesc) tags.push(`<meta name="twitter:description" content="${escapeHtml(ogDesc)}">`);
        if (ogImage) tags.push(`<meta name="twitter:image" content="${ogImage}">`);
        
        // Show in modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Generated Meta Tags</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <pre style="background: #1a1a2e; padding: 16px; border-radius: 8px; overflow-x: auto;"><code>${tags.join('\n')}</code></pre>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel">Close</button>
                    <button class="btn btn-primary" onclick="navigator.clipboard.writeText(\`${tags.join('\n').replace(/`/g, '\\`')}\`).then(() => showToast('Copied!', 'success'))">Copy to Clipboard</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.querySelector('.modal-cancel').onclick = () => modal.remove();
        modal.querySelector('.modal-backdrop').onclick = () => modal.remove();
    },
    
    // Save SEO settings
    saveSEOSettings() {
        const seoData = {
            title: document.getElementById('seo-title')?.value || '',
            description: document.getElementById('seo-description')?.value || '',
            keywords: document.getElementById('seo-keywords')?.value || '',
            ogTitle: document.getElementById('og-title')?.value || '',
            ogDescription: document.getElementById('og-description')?.value || '',
            ogImage: document.getElementById('og-image')?.value || '',
            ogType: document.getElementById('og-type')?.value || 'website',
            schemaType: document.getElementById('schema-type')?.value || 'none'
        };
        
        // Save to admin state
        if (typeof AdminState !== 'undefined') {
            if (!AdminState.content.settings) AdminState.content.settings = {};
            AdminState.content.settings.siteTitle = seoData.title;
            AdminState.content.settings.siteDescription = seoData.description;
            AdminState.content.settings.siteKeywords = seoData.keywords;
            AdminState.content.seo = seoData;
            saveContent();
        }
        
        // Save to local storage
        localStorage.setItem('seo_settings', JSON.stringify(seoData));
        
        showToast('SEO settings saved successfully!', 'success');
    }
};

// Initialize SEO tools when admin panel loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for admin panel to initialize
    setTimeout(() => {
        SEOTools.init();
    }, 500);
});
