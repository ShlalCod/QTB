/**
 * Content Loader for Portfolio
 * Reads content from localStorage (admin panel), API, or static JSON file
 * Updates the page dynamically including SEO and Open Graph tags
 */

(function() {
    'use strict';

    // Default content structure
    const defaultContent = {
        hero: {
            badge: 'Media Buyer & Digital Marketer',
            title: 'Scalable Profit Engineering',
            subtitle: "I've managed $8,000,000+ in ad budgets to move e-commerce stores from stagnation to profitable scale.",
            stat1Value: '$8M+',
            stat1Label: 'Ad Spend Managed',
            stat2Value: '3.2x',
            stat2Label: 'Avg. ROAS',
            stat3Value: '150+',
            stat3Label: 'Campaigns Optimized'
        },
        about: {
            title: 'About Me',
            description: 'A results-driven media buyer with expertise in paid social advertising.',
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
            whatsappMessage: 'Hi! I saw your portfolio.'
        },
        seo: {
            siteTitle: 'Media Buyer Portfolio',
            siteDescription: '',
            siteKeywords: '',
            siteUrl: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            twitterTitle: '',
            twitterDescription: '',
            twitterImage: ''
        },
        settings: {
            primaryColor: '#0E7C86',
            accentColor: '#FF6B5F',
            googleAnalytics: ''
        }
    };

    // Load content from sources
    async function loadContent() {
        let content = null;

        // 1. Try localStorage first (admin panel saves here)
        try {
            const stored = localStorage.getItem('portfolio_content');
            if (stored) {
                content = JSON.parse(stored);
                console.log('Content loaded from localStorage');
            }
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
        }

        // 2. Try API if no localStorage content
        if (!content) {
            try {
                const response = await fetch('/api/content');
                if (response.ok) {
                    content = await response.json();
                    console.log('Content loaded from Cloudflare KV');
                }
            } catch (e) {
                console.warn('Error loading from API:', e);
            }
        }

        // 3. Fallback to static JSON file
        if (!content) {
            try {
                const response = await fetch('data/content.json');
                if (response.ok) {
                    content = await response.json();
                    console.log('Content loaded from static file');
                }
            } catch (e) {
                console.warn('Error loading from static file:', e);
            }
        }

        // Merge with defaults to ensure all fields exist
        return mergeWithDefaults(content || {});
    }

    function mergeWithDefaults(content) {
        return {
            ...defaultContent,
            ...content,
            hero: { ...defaultContent.hero, ...content.hero },
            about: { ...defaultContent.about, ...content.about },
            contact: { ...defaultContent.contact, ...content.contact },
            seo: { ...defaultContent.seo, ...content.seo },
            settings: { ...defaultContent.settings, ...content.settings }
        };
    }

    // Update page content
    function updatePage(content) {
        // Update SEO and Meta tags first
        updateSEO(content.seo, content.settings);
        
        // Update Hero Section
        updateHero(content.hero);
        
        // Update About Section
        updateAbout(content.about);
        
        // Update Projects
        updateProjects(content.projects);
        
        // Update Skills
        updateSkills(content.skills);
        
        // Update Experience
        updateExperience(content.experience);
        
        // Update Services
        updateServices(content.services);
        
        // Update Contact
        updateContact(content.contact);
        
        // Update WhatsApp button
        updateWhatsApp(content.contact);
        
        // Update theme colors
        updateTheme(content.settings);
        
        // Load Google Analytics
        loadAnalytics(content.settings);
    }

    // Update SEO and Meta tags
    function updateSEO(seo, settings) {
        if (!seo) return;
        
        // Update page title
        if (seo.siteTitle) {
            document.title = seo.siteTitle;
            const titleMeta = document.querySelector('meta[name="title"]');
            if (titleMeta) titleMeta.setAttribute('content', seo.siteTitle);
        }
        
        // Update meta description
        if (seo.siteDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', seo.siteDescription);
        }
        
        // Update keywords
        if (seo.siteKeywords) {
            let keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (!keywordsMeta) {
                keywordsMeta = document.createElement('meta');
                keywordsMeta.name = 'keywords';
                document.head.appendChild(keywordsMeta);
            }
            keywordsMeta.setAttribute('content', seo.siteKeywords);
        }
        
        // Update canonical URL
        if (seo.siteUrl) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.rel = 'canonical';
                document.head.appendChild(canonical);
            }
            canonical.href = seo.siteUrl;
        }
        
        // Update Open Graph tags
        updateMetaTag('og:url', seo.siteUrl || window.location.href, 'property');
        updateMetaTag('og:title', seo.ogTitle || seo.siteTitle, 'property');
        updateMetaTag('og:description', seo.ogDescription || seo.siteDescription, 'property');
        updateMetaTag('og:image', seo.ogImage, 'property');
        
        // Update Twitter Card tags
        updateMetaTag('twitter:url', seo.siteUrl || window.location.href, 'name');
        updateMetaTag('twitter:title', seo.twitterTitle || seo.ogTitle || seo.siteTitle, 'name');
        updateMetaTag('twitter:description', seo.twitterDescription || seo.ogDescription || seo.siteDescription, 'name');
        updateMetaTag('twitter:image', seo.twitterImage || seo.ogImage, 'name');
        
        // Update Schema JSON-LD
        updateSchema(seo);
    }
    
    function updateMetaTag(name, content, attrType = 'name') {
        if (!content) return;
        let meta = document.querySelector(`meta[${attrType}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attrType, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }
    
    function updateSchema(seo) {
        const schemaScript = document.getElementById('schema-script');
        if (schemaScript && seo.siteUrl) {
            const schema = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": seo.siteTitle || "Media Buyer Portfolio",
                "description": seo.siteDescription || "",
                "url": seo.siteUrl
            };
            if (seo.ogImage) {
                schema.image = seo.ogImage;
            }
            schemaScript.textContent = JSON.stringify(schema);
        }
    }

    function updateTheme(settings) {
        if (!settings) return;
        
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
        }
        if (settings.accentColor) {
            document.documentElement.style.setProperty('--color-accent', settings.accentColor);
        }
    }
    
    function loadAnalytics(settings) {
        if (!settings || !settings.googleAnalytics) return;
        
        // Load Google Analytics
        const gaId = settings.googleAnalytics;
        if (gaId.startsWith('G-')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', gaId);
        }
    }

    function updateHero(hero) {
        if (!hero) return;
        
        // Badge
        const badge = document.querySelector('.hero-badge');
        if (badge) badge.textContent = hero.badge || '';
        
        // Title
        const title = document.querySelector('#hero-title');
        if (title) {
            title.innerHTML = `${hero.title || ''}<span class="hero-title-accent">— where data meets buyer psychology.</span>`;
        }
        
        // Subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle && hero.subtitle) {
            subtitle.innerHTML = hero.subtitle;
        }
        
        // Stats
        const stats = document.querySelectorAll('.hero-stat');
        if (stats.length >= 3) {
            stats[0].querySelector('.stat-value').textContent = hero.stat1Value || '';
            stats[0].querySelector('.stat-label').textContent = hero.stat1Label || '';
            stats[1].querySelector('.stat-value').textContent = hero.stat2Value || '';
            stats[1].querySelector('.stat-label').textContent = hero.stat2Label || '';
            stats[2].querySelector('.stat-value').textContent = hero.stat3Value || '';
            stats[2].querySelector('.stat-label').textContent = hero.stat3Label || '';
        }
    }

    function updateAbout(about) {
        if (!about) return;
        
        const aboutTitle = document.querySelector('#about .section-title');
        if (aboutTitle) aboutTitle.textContent = about.title || 'About Me';
        
        const aboutDesc = document.querySelector('#about .about-description');
        if (aboutDesc && about.description) {
            aboutDesc.innerHTML = about.description.replace(/\n/g, '<br>');
        }
        
        const aboutImage = document.querySelector('#about .about-image img');
        if (aboutImage && about.image) {
            aboutImage.src = about.image;
        }
    }

    function updateProjects(projects) {
        if (!projects || projects.length === 0) return;
        
        const container = document.querySelector('#projects .projects-grid');
        if (!container) return;
        
        if (projects.length > 0) {
            container.innerHTML = projects.map((project, index) => `
                <article class="project-card fade-in-up" style="animation-delay: ${index * 0.1}s;" data-project="${index + 1}">
                    <div class="project-image">
                        ${project.image ? 
                            `<img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy">` :
                            `<div class="project-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>`
                        }
                    </div>
                    <div class="project-content">
                        <span class="project-category">${escapeHtml(project.category || '')}</span>
                        <h3 class="project-title">${escapeHtml(project.title || '')}</h3>
                        <p class="project-description">${escapeHtml(project.description || '')}</p>
                        <div class="project-metrics">
                            ${project.roas ? `<div class="metric"><span class="metric-value">${escapeHtml(project.roas)}</span><span class="metric-label">ROAS</span></div>` : ''}
                            ${project.spend ? `<div class="metric"><span class="metric-value">$${formatNumber(project.spend)}</span><span class="metric-label">Spend</span></div>` : ''}
                        </div>
                    </div>
                </article>
            `).join('');
        }
    }

    function updateSkills(skills) {
        if (!skills || skills.length === 0) return;
        
        const container = document.querySelector('#skills .skills-grid');
        if (!container) return;
        
        container.innerHTML = skills.map((skill, index) => `
            <div class="skill-card fade-in-up" style="animation-delay: ${index * 0.05}s;">
                <div class="skill-header">
                    <h3 class="skill-name">${escapeHtml(skill.name || '')}</h3>
                    <span class="skill-category">${escapeHtml(skill.category || '')}</span>
                </div>
                <div class="skill-level">
                    <div class="skill-progress" style="width: ${skill.level || 0}%"></div>
                </div>
                <span class="skill-percent">${skill.level || 0}%</span>
            </div>
        `).join('');
    }

    function updateExperience(experience) {
        if (!experience || experience.length === 0) return;
        
        const container = document.querySelector('#experience .experience-timeline');
        if (!container) return;
        
        container.innerHTML = experience.map((exp, index) => `
            <article class="experience-card fade-in-up" style="animation-delay: ${index * 0.1}s;">
                <div class="experience-marker"></div>
                <div class="experience-content">
                    <div class="experience-header">
                        <h3 class="experience-title">${escapeHtml(exp.title || '')}</h3>
                        <span class="experience-period">${escapeHtml(exp.period || '')}</span>
                    </div>
                    <p class="experience-company">${escapeHtml(exp.company || '')}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</p>
                    <p class="experience-description">${escapeHtml(exp.description || '')}</p>
                </div>
            </article>
        `).join('');
    }

    function updateServices(services) {
        if (!services || services.length === 0) return;
        
        const container = document.querySelector('#services .services-grid');
        if (!container) return;
        
        container.innerHTML = services.map((service, index) => `
            <article class="service-card fade-in-up" style="animation-delay: ${index * 0.1}s;">
                <div class="service-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                </div>
                <h3 class="service-title">${escapeHtml(service.title || '')}</h3>
                <p class="service-description">${escapeHtml(service.description || '')}</p>
            </article>
        `).join('');
    }

    function updateContact(contact) {
        if (!contact) return;
        
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink && contact.email) {
            emailLink.href = `mailto:${contact.email}`;
            emailLink.textContent = contact.email;
        }
        
        const phoneLink = document.querySelector('a[href^="tel:"]');
        if (phoneLink && contact.phone) {
            phoneLink.href = `tel:${contact.phone}`;
            phoneLink.textContent = contact.phone;
        }
        
        const linkedinLink = document.querySelector('a[href*="linkedin.com"]');
        if (linkedinLink && contact.linkedin) {
            linkedinLink.href = contact.linkedin;
        }
        
        const twitterLink = document.querySelector('a[href*="twitter.com"]');
        if (twitterLink && contact.twitter) {
            twitterLink.href = contact.twitter;
        }
    }

    function updateWhatsApp(contact) {
        const whatsappBtn = document.getElementById('whatsapp-button');
        const whatsappLink = document.getElementById('whatsapp-link');
        
        if (!whatsappBtn || !whatsappLink) return;
        
        if (contact && contact.whatsappEnabled && contact.whatsapp) {
            const message = encodeURIComponent(contact.whatsappMessage || 'Hi! I saw your portfolio...');
            whatsappLink.href = `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
            whatsappBtn.hidden = false;
        } else {
            whatsappBtn.hidden = true;
        }
    }

    // Utility functions
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', async function() {
        try {
            const content = await loadContent();
            updatePage(content);
            console.log('Content loaded and applied successfully');
        } catch (error) {
            console.error('Error loading content:', error);
        }
    });

    // Listen for storage changes (when admin saves)
    window.addEventListener('storage', async function(e) {
        if (e.key === 'portfolio_content') {
            console.log('Content updated in another tab, reloading...');
            const content = await loadContent();
            updatePage(content);
        }
    });

    // Expose function to manually refresh content
    window.refreshContent = async function() {
        const content = await loadContent();
        updatePage(content);
        return content;
    };

})();
