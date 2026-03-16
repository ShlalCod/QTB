/**
 * Admin Panel JavaScript
 * Cloudflare Pages Version with Password Protection
 * Content saved to localStorage + Cloudflare KV via API
 * Media files stored in Cloudflare R2
 */

'use strict';

// ============================================
// Password Protection
// ============================================
const AUTH_KEY = 'qtmb_admin_auth';

function checkAuth() {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'authenticated';
    if (isAuth) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').hidden = false;
    document.getElementById('loading-screen').hidden = true;
    document.getElementById('admin-panel').hidden = true;
}

function showAdminPanel() {
    document.getElementById('login-screen').hidden = true;
    document.getElementById('loading-screen').hidden = true;
    document.getElementById('admin-panel').hidden = false;
}

async function verifyPassword(password) {
    try {
        // First check against env variable via API
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (response.ok) {
            return true;
        }
    } catch (e) {
        console.log('API auth not available, using fallback');
    }
    
    // Fallback: check stored password hash
    const storedHash = localStorage.getItem('admin_password_hash');
    if (storedHash) {
        const hash = await hashPassword(password);
        return hash === storedHash;
    }
    
    // Default password for first setup
    return password === 'qtmb2024admin';
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
}

// ============================================
// Global State
// ============================================
const AdminState = {
    content: null,
    hasUnsavedChanges: false,
    currentSection: 'dashboard',
    initialized: false
};

// Default content structure
const DefaultContent = {
    hero: {
        badge: 'Media Buyer & Digital Marketer',
        title: 'Scalable Profit Engineering',
        subtitle: "I've managed $8,000,000+ in ad budgets to move e-commerce stores from stagnation to profitable scale. We don't buy clicks — we build systems that attract high-LTV customers.",
        stat1Value: '$8M+',
        stat1Label: 'Ad Spend Managed',
        stat2Value: '3.2x',
        stat2Label: 'Avg. ROAS',
        stat3Value: '150+',
        stat3Label: 'Campaigns Optimized'
    },
    about: {
        title: 'About Me',
        description: 'A results-driven media buyer with expertise in paid social advertising, conversion optimization, and data-driven marketing strategies.',
        image: ''
    },
    projects: [],
    skills: [],
    experience: [],
    services: [],
    contact: {
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        whatsapp: '',
        whatsappEnabled: true,
        whatsappMessage: 'Hi! I saw your portfolio and would like to discuss a potential project.'
    },
    seo: {
        siteTitle: 'Media Buyer Portfolio',
        siteDescription: 'Portfolio website for a Media Buyer / Digital Marketer specializing in profitable scale systems and high-LTV customer acquisition.',
        siteKeywords: 'Media Buyer, Digital Marketer, Ad Campaign Optimization, ROAS, CPA, KPI Dashboard',
        siteUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: ''
    },
    settings: {
        googleAnalytics: '',
        primaryColor: '#0E7C86',
        accentColor: '#FF6B5F',
        roasThreshold: 1.5,
        cpaMultiplier: 1.3
    }
};

// ============================================
// Utility Functions
// ============================================

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function generateId() {
    return 'id-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ============================================
// Content Management
// ============================================

async function loadContent() {
    try {
        const response = await fetch('/api/content');
        if (response.ok) {
            AdminState.content = await response.json();
            console.log('Content loaded from Cloudflare KV');
        } else {
            const stored = localStorage.getItem('portfolio_content');
            AdminState.content = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DefaultContent));
        }
    } catch (error) {
        console.log('Loading content from localStorage');
        const stored = localStorage.getItem('portfolio_content');
        AdminState.content = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DefaultContent));
    }
    
    populateForms();
    updateDashboardCounts();
}

function saveContent() {
    localStorage.setItem('portfolio_content', JSON.stringify(AdminState.content));
    saveToAPI();
    AdminState.hasUnsavedChanges = false;
    showToast('Content saved successfully!', 'success');
}

async function saveToAPI() {
    try {
        const response = await fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(AdminState.content)
        });
        
        if (response.ok) {
            console.log('Content saved to Cloudflare KV');
        }
    } catch (error) {
        console.log('API save error:', error);
    }
}

function populateForms() {
    const content = AdminState.content;
    
    // SEO form
    if (content.seo) {
        const seoFields = ['siteTitle', 'siteDescription', 'siteKeywords', 'siteUrl', 'ogTitle', 'ogDescription', 'ogImage', 'twitterTitle', 'twitterDescription', 'twitterImage'];
        seoFields.forEach(field => {
            const el = document.getElementById(`seo-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if (el) el.value = content.seo[field] || '';
        });
        updateSEOPreview();
    }
    
    // Hero form
    if (content.hero) {
        const fields = ['badge', 'title', 'subtitle', 'stat1Value', 'stat1Label', 'stat2Value', 'stat2Label', 'stat3Value', 'stat3Label'];
        fields.forEach(field => {
            const el = document.getElementById(`hero-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if (el) el.value = content.hero[field] || '';
        });
        const heroTitle = document.getElementById('hero-title-input');
        if (heroTitle) heroTitle.value = content.hero.title || '';
    }
    
    // About form
    if (content.about) {
        ['title', 'description', 'image'].forEach(field => {
            const el = document.getElementById(`about-${field}`);
            if (el) el.value = content.about[field] || '';
        });
    }
    
    // Contact form
    if (content.contact) {
        const fields = ['email', 'phone', 'linkedin', 'twitter', 'whatsapp', 'whatsappMessage'];
        fields.forEach(field => {
            const el = document.getElementById(`contact-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if (el) {
                if (el.type === 'checkbox') {
                    el.checked = content.contact[field] !== false;
                } else {
                    el.value = content.contact[field] || '';
                }
            }
        });
    }
    
    // Settings form
    if (content.settings) {
        const fields = {
            'google-analytics': 'googleAnalytics',
            'primary-color': 'primaryColor',
            'accent-color': 'accentColor',
            'audit-roas': 'roasThreshold',
            'audit-cpa': 'cpaMultiplier'
        };
        
        Object.entries(fields).forEach(([elId, contentKey]) => {
            const el = document.getElementById(elId);
            if (el && content.settings[contentKey] !== undefined) {
                el.value = content.settings[contentKey];
            }
        });
    }
    
    renderProjectsList();
    renderSkillsList();
    renderExperienceList();
    renderServicesList();
}

function updateSEOPreview() {
    const ogTitle = document.getElementById('og-title')?.value || document.getElementById('seo-site-title')?.value || 'Your Site Title';
    const ogDesc = document.getElementById('og-description')?.value || document.getElementById('seo-site-description')?.value || 'Your description will appear here...';
    const ogImage = document.getElementById('og-image')?.value;
    const siteUrl = document.getElementById('seo-site-url')?.value || 'yoursite.com';
    
    const titlePreview = document.getElementById('og-title-preview');
    const descPreview = document.getElementById('og-desc-preview');
    const urlPreview = document.getElementById('og-url-preview');
    const imagePreview = document.getElementById('og-image-preview');
    
    if (titlePreview) titlePreview.textContent = ogTitle;
    if (descPreview) descPreview.textContent = ogDesc.substring(0, 100) + (ogDesc.length > 100 ? '...' : '');
    if (urlPreview) {
        try {
            urlPreview.textContent = new URL(siteUrl).hostname;
        } catch {
            urlPreview.textContent = siteUrl.replace(/^https?:\/\//, '').split('/')[0];
        }
    }
    if (imagePreview && ogImage) {
        imagePreview.style.backgroundImage = `url(${ogImage})`;
        imagePreview.innerHTML = '';
    } else if (imagePreview) {
        imagePreview.style.backgroundImage = '';
        imagePreview.innerHTML = '<span>No image</span>';
    }
    
    // Update description counter
    const descInput = document.getElementById('seo-site-description');
    const descCount = document.getElementById('desc-count');
    if (descInput && descCount) {
        descCount.textContent = descInput.value.length;
    }
}

function updateDashboardCounts() {
    const projectsCount = document.getElementById('projects-count');
    const skillsCount = document.getElementById('skills-count');
    const expCount = document.getElementById('experience-count');
    const servicesCount = document.getElementById('services-count');
    
    if (projectsCount) projectsCount.textContent = AdminState.content.projects?.length || 0;
    if (skillsCount) skillsCount.textContent = AdminState.content.skills?.length || 0;
    if (expCount) expCount.textContent = AdminState.content.experience?.length || 0;
    if (servicesCount) servicesCount.textContent = AdminState.content.services?.length || 0;
}

// ============================================
// Admin Panel Initialization
// ============================================

function initAdminPanel() {
    initNavigation();
    initForms();
    initModals();
    initQuickActions();
    initSidebar();
    initSEOListeners();
    initPasswordToggle();
    
    window.addEventListener('beforeunload', (e) => {
        if (AdminState.hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.toggle('active', section.id === `section-${sectionId}`);
    });
    
    const titles = {
        dashboard: 'Dashboard',
        seo: 'SEO & Meta',
        hero: 'Hero Section',
        about: 'About Section',
        projects: 'Projects',
        skills: 'Skills',
        experience: 'Experience',
        services: 'Services',
        contact: 'Contact Information',
        media: 'Media Library',
        settings: 'Settings'
    };
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = titles[sectionId] || 'Dashboard';
    AdminState.currentSection = sectionId;
    
    document.querySelector('.admin-sidebar')?.classList.remove('open');
}

function initSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    toggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && 
            sidebar?.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !toggle?.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

function initPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('admin-password');
    const eyeIcon = toggleBtn?.querySelector('.eye-icon');
    const eyeOffIcon = toggleBtn?.querySelector('.eye-off-icon');
    
    toggleBtn?.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        if (eyeIcon) eyeIcon.style.display = isPassword ? 'none' : 'block';
        if (eyeOffIcon) eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    });
}

function initSEOListeners() {
    const seoInputs = ['seo-site-title', 'seo-site-description', 'seo-site-url', 'og-title', 'og-description', 'og-image'];
    seoInputs.forEach(id => {
        const el = document.getElementById(id);
        el?.addEventListener('input', updateSEOPreview);
    });
}

// ============================================
// Form Handlers
// ============================================

function initForms() {
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        const errorEl = document.getElementById('login-error');
        
        if (await verifyPassword(password)) {
            sessionStorage.setItem(AUTH_KEY, 'authenticated');
            showAdminPanel();
            await loadContent();
            initAdminPanel();
            showToast('Welcome to Admin Panel!', 'success');
        } else {
            errorEl.style.display = 'block';
            errorEl.textContent = 'Invalid password. Please try again.';
        }
    });
    
    // SEO form
    document.getElementById('seo-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        AdminState.content.seo = {
            siteTitle: form.siteTitle?.value || '',
            siteDescription: form.siteDescription?.value || '',
            siteKeywords: form.siteKeywords?.value || '',
            siteUrl: form.siteUrl?.value || '',
            ogTitle: form.ogTitle?.value || '',
            ogDescription: form.ogDescription?.value || '',
            ogImage: form.ogImage?.value || '',
            twitterTitle: form.twitterTitle?.value || '',
            twitterDescription: form.twitterDescription?.value || '',
            twitterImage: form.twitterImage?.value || ''
        };
        saveContent();
    });
    
    // Hero form
    document.getElementById('hero-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        AdminState.content.hero = {
            badge: form.badge?.value || '',
            title: form.title?.value || '',
            subtitle: form.subtitle?.value || '',
            stat1Value: form.stat1Value?.value || '',
            stat1Label: form.stat1Label?.value || '',
            stat2Value: form.stat2Value?.value || '',
            stat2Label: form.stat2Label?.value || '',
            stat3Value: form.stat3Value?.value || '',
            stat3Label: form.stat3Label?.value || ''
        };
        saveContent();
    });
    
    // About form
    document.getElementById('about-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        AdminState.content.about = {
            title: form.title?.value || '',
            description: form.description?.value || '',
            image: form.image?.value || ''
        };
        saveContent();
    });
    
    // Contact form
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        AdminState.content.contact = {
            email: form.email?.value || '',
            phone: form.phone?.value || '',
            linkedin: form.linkedin?.value || '',
            twitter: form.twitter?.value || '',
            whatsapp: form.whatsapp?.value || '',
            whatsappEnabled: form.whatsappEnabled?.checked ?? true,
            whatsappMessage: form.whatsappMessage?.value || ''
        };
        saveContent();
    });
    
    // Settings form
    document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        AdminState.content.settings = {
            googleAnalytics: form.googleAnalytics?.value || '',
            primaryColor: form.primaryColor?.value || '#0E7C86',
            accentColor: form.accentColor?.value || '#FF6B5F',
            roasThreshold: parseFloat(form.roasThreshold?.value) || 1.5,
            cpaMultiplier: parseFloat(form.cpaMultiplier?.value) || 1.3
        };
        
        // Update password if provided
        const newPassword = form.newAdminPassword?.value;
        if (newPassword) {
            const hash = await hashPassword(newPassword);
            localStorage.setItem('admin_password_hash', hash);
            showToast('Password updated successfully!', 'success');
        }
        
        saveContent();
    });
    
    // Save all button
    document.getElementById('save-all-btn')?.addEventListener('click', saveContent);
    
    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    
    // Track changes
    document.querySelectorAll('.editor-form input, .editor-form textarea').forEach(input => {
        input.addEventListener('input', () => {
            AdminState.hasUnsavedChanges = true;
        });
    });
}

// ============================================
// Items Management
// ============================================

function renderProjectsList() {
    const container = document.getElementById('projects-list');
    if (!container) return;
    const projects = AdminState.content.projects || [];
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No projects added yet</p>
                <button class="btn btn-primary" onclick="openProjectModal()">Add Your First Project</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = projects.map((project, index) => `
        <div class="item-card" data-index="${index}" draggable="true">
            <div class="item-drag-handle">⋮⋮</div>
            <div class="item-info">
                <div class="item-title">${escapeHtml(project.title || 'Untitled')}</div>
                <div class="item-meta">${escapeHtml(project.category || '')} ${project.roas ? `• ROAS: ${project.roas}` : ''}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-icon btn-sm" onclick="editProject(${index})" title="Edit">✏️</button>
                <button class="btn btn-icon btn-sm" onclick="deleteProject(${index})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    initItemDragAndDrop(container, 'projects');
}

function renderSkillsList() {
    const container = document.getElementById('skills-list');
    if (!container) return;
    const skills = AdminState.content.skills || [];
    
    if (skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No skills added yet</p>
                <button class="btn btn-primary" onclick="openSkillModal()">Add Your First Skill</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = skills.map((skill, index) => `
        <div class="item-card" data-index="${index}" draggable="true">
            <div class="item-drag-handle">⋮⋮</div>
            <div class="item-info">
                <div class="item-title">${escapeHtml(skill.name || 'Untitled')}</div>
                <div class="item-meta">${escapeHtml(skill.category || '')} ${skill.level ? `• Level: ${skill.level}%` : ''}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-icon btn-sm" onclick="editSkill(${index})" title="Edit">✏️</button>
                <button class="btn btn-icon btn-sm" onclick="deleteSkill(${index})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    initItemDragAndDrop(container, 'skills');
}

function renderExperienceList() {
    const container = document.getElementById('experience-list');
    if (!container) return;
    const experiences = AdminState.content.experience || [];
    
    if (experiences.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No experience added yet</p>
                <button class="btn btn-primary" onclick="openExperienceModal()">Add Your First Experience</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = experiences.map((exp, index) => `
        <div class="item-card" data-index="${index}" draggable="true">
            <div class="item-drag-handle">⋮⋮</div>
            <div class="item-info">
                <div class="item-title">${escapeHtml(exp.title || 'Untitled')}</div>
                <div class="item-meta">${escapeHtml(exp.company || '')} ${exp.period ? `• ${exp.period}` : ''}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-icon btn-sm" onclick="editExperience(${index})" title="Edit">✏️</button>
                <button class="btn btn-icon btn-sm" onclick="deleteExperience(${index})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    initItemDragAndDrop(container, 'experience');
}

function renderServicesList() {
    const container = document.getElementById('services-list');
    if (!container) return;
    const services = AdminState.content.services || [];
    
    if (services.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No services added yet</p>
                <button class="btn btn-primary" onclick="openServiceModal()">Add Your First Service</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = services.map((service, index) => `
        <div class="item-card" data-index="${index}" draggable="true">
            <div class="item-drag-handle">⋮⋮</div>
            <div class="item-info">
                <div class="item-title">${escapeHtml(service.title || 'Untitled')}</div>
                <div class="item-meta">${escapeHtml(service.description?.substring(0, 50) || '')}${service.description?.length > 50 ? '...' : ''}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-icon btn-sm" onclick="editService(${index})" title="Edit">✏️</button>
                <button class="btn btn-icon btn-sm" onclick="deleteService(${index})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    initItemDragAndDrop(container, 'services');
}

// ============================================
// Drag and Drop
// ============================================

function initItemDragAndDrop(container, type) {
    let draggedItem = null;
    
    container.querySelectorAll('.item-card').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem !== item) {
                const rect = item.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (e.clientY < midY) {
                    container.insertBefore(draggedItem, item);
                } else {
                    container.insertBefore(draggedItem, item.nextSibling);
                }
            }
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            reorderItems(container, type);
        });
    });
}

function reorderItems(container, type) {
    const items = container.querySelectorAll('.item-card');
    const newOrder = [];
    
    items.forEach(item => {
        const index = parseInt(item.dataset.index);
        newOrder.push(AdminState.content[type][index]);
    });
    
    AdminState.content[type] = newOrder;
    saveContent();
    renderItemsList(type);
}

function renderItemsList(type) {
    switch (type) {
        case 'projects': renderProjectsList(); break;
        case 'skills': renderSkillsList(); break;
        case 'experience': renderExperienceList(); break;
        case 'services': renderServicesList(); break;
    }
}

// ============================================
// Modal Management
// ============================================

let currentModalContext = null;

function initModals() {
    document.querySelectorAll('.modal-backdrop, .modal-cancel').forEach(el => {
        el.addEventListener('click', closeModal);
    });
    
    document.querySelectorAll('.modal-close').forEach(el => {
        el.addEventListener('click', closeModal);
    });
    
    document.querySelector('.modal-save')?.addEventListener('click', saveModalData);
    document.querySelector('.confirm-cancel')?.addEventListener('click', closeConfirm);
    document.querySelector('.confirm-backdrop')?.addEventListener('click', closeConfirm);
    
    document.getElementById('add-project-btn')?.addEventListener('click', () => openProjectModal());
    document.getElementById('add-skill-btn')?.addEventListener('click', () => openSkillModal());
    document.getElementById('add-experience-btn')?.addEventListener('click', () => openExperienceModal());
    document.getElementById('add-service-btn')?.addEventListener('click', () => openServiceModal());
}

function openModal(title, content) {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('item-modal');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = content;
    if (modal) modal.hidden = false;
}

function closeModal() {
    const modal = document.getElementById('item-modal');
    if (modal) modal.hidden = true;
    currentModalContext = null;
}

function openProjectModal(index = null) {
    const project = index !== null ? AdminState.content.projects?.[index] : {};
    currentModalContext = { type: 'project', index };
    
    openModal(index !== null ? 'Edit Project' : 'Add Project', `
        <form id="project-form">
            <div class="form-group">
                <label for="project-title">Project Title</label>
                <input type="text" id="project-title" name="title" value="${escapeHtml(project.title || '')}" required>
            </div>
            <div class="form-group">
                <label for="project-category">Category</label>
                <input type="text" id="project-category" name="category" value="${escapeHtml(project.category || '')}" placeholder="e.g., E-commerce, SaaS">
            </div>
            <div class="form-group">
                <label for="project-description">Description</label>
                <textarea id="project-description" name="description" rows="3">${escapeHtml(project.description || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="project-spend">Ad Spend ($)</label>
                    <input type="number" id="project-spend" name="spend" value="${project.spend || ''}">
                </div>
                <div class="form-group">
                    <label for="project-roas">ROAS</label>
                    <input type="text" id="project-roas" name="roas" value="${escapeHtml(project.roas || '')}" placeholder="e.g., 3.2x">
                </div>
            </div>
            <div class="form-group">
                <label for="project-image">Image URL</label>
                <input type="url" id="project-image" name="image" value="${escapeHtml(project.image || '')}">
            </div>
            <div class="form-group">
                <label for="project-link">Project Link</label>
                <input type="url" id="project-link" name="link" value="${escapeHtml(project.link || '')}">
            </div>
        </form>
    `);
}

function openSkillModal(index = null) {
    const skill = index !== null ? AdminState.content.skills?.[index] : {};
    currentModalContext = { type: 'skill', index };
    
    openModal(index !== null ? 'Edit Skill' : 'Add Skill', `
        <form id="skill-form">
            <div class="form-group">
                <label for="skill-name">Skill Name</label>
                <input type="text" id="skill-name" name="name" value="${escapeHtml(skill.name || '')}" required>
            </div>
            <div class="form-group">
                <label for="skill-category">Category</label>
                <select id="skill-category" name="category">
                    <option value="">Select category</option>
                    <option value="Advertising" ${skill.category === 'Advertising' ? 'selected' : ''}>Advertising</option>
                    <option value="Analytics" ${skill.category === 'Analytics' ? 'selected' : ''}>Analytics</option>
                    <option value="Creative" ${skill.category === 'Creative' ? 'selected' : ''}>Creative</option>
                    <option value="Technical" ${skill.category === 'Technical' ? 'selected' : ''}>Technical</option>
                    <option value="Strategy" ${skill.category === 'Strategy' ? 'selected' : ''}>Strategy</option>
                </select>
            </div>
            <div class="form-group">
                <label for="skill-level">Proficiency Level (%)</label>
                <input type="range" id="skill-level" name="level" min="0" max="100" value="${skill.level || 80}" oninput="document.getElementById('skill-level-display').textContent = this.value + '%'">
                <span id="skill-level-display">${skill.level || 80}%</span>
            </div>
        </form>
    `);
}

function openExperienceModal(index = null) {
    const exp = index !== null ? AdminState.content.experience?.[index] : {};
    currentModalContext = { type: 'experience', index };
    
    openModal(index !== null ? 'Edit Experience' : 'Add Experience', `
        <form id="experience-form">
            <div class="form-group">
                <label for="exp-title">Job Title</label>
                <input type="text" id="exp-title" name="title" value="${escapeHtml(exp.title || '')}" required>
            </div>
            <div class="form-group">
                <label for="exp-company">Company</label>
                <input type="text" id="exp-company" name="company" value="${escapeHtml(exp.company || '')}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="exp-period">Period</label>
                    <input type="text" id="exp-period" name="period" value="${escapeHtml(exp.period || '')}" placeholder="e.g., 2020 - Present">
                </div>
                <div class="form-group">
                    <label for="exp-location">Location</label>
                    <input type="text" id="exp-location" name="location" value="${escapeHtml(exp.location || '')}">
                </div>
            </div>
            <div class="form-group">
                <label for="exp-description">Description</label>
                <textarea id="exp-description" name="description" rows="4">${escapeHtml(exp.description || '')}</textarea>
            </div>
        </form>
    `);
}

function openServiceModal(index = null) {
    const service = index !== null ? AdminState.content.services?.[index] : {};
    currentModalContext = { type: 'service', index };
    
    openModal(index !== null ? 'Edit Service' : 'Add Service', `
        <form id="service-form">
            <div class="form-group">
                <label for="service-title">Service Title</label>
                <input type="text" id="service-title" name="title" value="${escapeHtml(service.title || '')}" required>
            </div>
            <div class="form-group">
                <label for="service-description">Description</label>
                <textarea id="service-description" name="description" rows="4">${escapeHtml(service.description || '')}</textarea>
            </div>
            <div class="form-group">
                <label for="service-icon">Icon Name</label>
                <input type="text" id="service-icon" name="icon" value="${escapeHtml(service.icon || '')}" placeholder="e.g., target, chart, users">
            </div>
        </form>
    `);
}

function saveModalData() {
    if (!currentModalContext) return;
    
    const { type, index } = currentModalContext;
    const form = document.querySelector('#modal-body form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (data.level) data.level = parseInt(data.level);
    if (data.spend) data.spend = parseFloat(data.spend);
    
    switch (type) {
        case 'project':
            if (!AdminState.content.projects) AdminState.content.projects = [];
            if (index !== null) {
                AdminState.content.projects[index] = data;
            } else {
                AdminState.content.projects.push(data);
            }
            renderProjectsList();
            break;
        case 'skill':
            if (!AdminState.content.skills) AdminState.content.skills = [];
            if (index !== null) {
                AdminState.content.skills[index] = data;
            } else {
                AdminState.content.skills.push(data);
            }
            renderSkillsList();
            break;
        case 'experience':
            if (!AdminState.content.experience) AdminState.content.experience = [];
            if (index !== null) {
                AdminState.content.experience[index] = data;
            } else {
                AdminState.content.experience.push(data);
            }
            renderExperienceList();
            break;
        case 'service':
            if (!AdminState.content.services) AdminState.content.services = [];
            if (index !== null) {
                AdminState.content.services[index] = data;
            } else {
                AdminState.content.services.push(data);
            }
            renderServicesList();
            break;
    }
    
    updateDashboardCounts();
    saveContent();
    closeModal();
}

// Edit functions
function editProject(index) { openProjectModal(index); }
function editSkill(index) { openSkillModal(index); }
function editExperience(index) { openExperienceModal(index); }
function editService(index) { openServiceModal(index); }

// Delete functions
function deleteProject(index) {
    showConfirm('Delete Project', 'Are you sure you want to delete this project?', () => {
        AdminState.content.projects.splice(index, 1);
        renderProjectsList();
        updateDashboardCounts();
        saveContent();
    });
}

function deleteSkill(index) {
    showConfirm('Delete Skill', 'Are you sure you want to delete this skill?', () => {
        AdminState.content.skills.splice(index, 1);
        renderSkillsList();
        updateDashboardCounts();
        saveContent();
    });
}

function deleteExperience(index) {
    showConfirm('Delete Experience', 'Are you sure you want to delete this experience?', () => {
        AdminState.content.experience.splice(index, 1);
        renderExperienceList();
        updateDashboardCounts();
        saveContent();
    });
}

function deleteService(index) {
    showConfirm('Delete Service', 'Are you sure you want to delete this service?', () => {
        AdminState.content.services.splice(index, 1);
        renderServicesList();
        updateDashboardCounts();
        saveContent();
    });
}

// ============================================
// Confirm Dialog
// ============================================

let confirmCallback = null;

function showConfirm(title, message, callback) {
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMsg = document.getElementById('confirm-message');
    const confirmDialog = document.getElementById('confirm-dialog');
    
    if (confirmTitle) confirmTitle.textContent = title;
    if (confirmMsg) confirmMsg.textContent = message;
    if (confirmDialog) confirmDialog.hidden = false;
    confirmCallback = callback;
}

function closeConfirm() {
    const confirmDialog = document.getElementById('confirm-dialog');
    if (confirmDialog) confirmDialog.hidden = true;
    confirmCallback = null;
}

document.querySelector('.confirm-ok')?.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirm();
});

// ============================================
// Quick Actions
// ============================================

function initQuickActions() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch (action) {
        case 'add-project':
            navigateToSection('projects');
            openProjectModal();
            break;
        case 'add-skill':
            navigateToSection('skills');
            openSkillModal();
            break;
        case 'export-content':
            exportContent();
            break;
        case 'preview-site':
            window.open('index.html', '_blank');
            break;
    }
}

function exportContent() {
    const dataStr = JSON.stringify(AdminState.content, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Content exported successfully!', 'success');
}

// ============================================
// Initialize on Load
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
});
