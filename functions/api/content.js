/**
 * Cloudflare Pages Function: Content API
 * Handles CRUD operations for portfolio content
 * Uses Cloudflare KV for persistent storage
 */

const defaultContent = {
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
    projects: [
        {
            id: 'proj-1',
            title: 'E-commerce Scale Campaign',
            category: 'E-commerce',
            description: 'Scaled a fashion e-commerce brand from $50K to $500K monthly ad spend while maintaining 4.2x ROAS.',
            spend: 500000,
            roas: '4.2x',
            image: '',
            link: ''
        },
        {
            id: 'proj-2',
            title: 'SaaS Lead Generation',
            category: 'SaaS',
            description: 'Built a lead generation system that reduced CPA by 60% while doubling monthly qualified leads.',
            spend: 120000,
            roas: '3.8x',
            image: '',
            link: ''
        }
    ],
    skills: [
        { id: 'skill-1', name: 'Facebook Ads', category: 'Advertising', level: 95 },
        { id: 'skill-2', name: 'Google Ads', category: 'Advertising', level: 90 },
        { id: 'skill-3', name: 'Data Analysis', category: 'Analytics', level: 85 },
        { id: 'skill-4', name: 'Conversion Optimization', category: 'Strategy', level: 88 }
    ],
    experience: [
        {
            id: 'exp-1',
            title: 'Senior Media Buyer',
            company: 'Digital Marketing Agency',
            period: '2021 - Present',
            location: 'Remote',
            description: 'Managing $2M+ monthly ad spend across multiple e-commerce brands. Achieved average 3.5x ROAS across portfolio.'
        }
    ],
    services: [
        {
            id: 'srv-1',
            title: 'Paid Advertising',
            description: 'Full-funnel paid social and search advertising campaigns on Facebook, Instagram, Google, and TikTok.',
            icon: 'target'
        },
        {
            id: 'srv-2',
            title: 'Conversion Optimization',
            description: 'Data-driven landing page optimization, A/B testing, and funnel analysis to maximize ROI.',
            icon: 'chart'
        }
    ],
    contact: {
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/yourprofile',
        twitter: 'https://twitter.com/yourhandle',
        whatsapp: '+1234567890',
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

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
};

// Deep merge helper
function deepMerge(target, source) {
    const output = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    }
    return output;
}

// GET - Retrieve content
export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // Try to get from KV
        if (env.CONTENT) {
            const stored = await env.CONTENT.get('portfolio-content', { type: 'json' });
            if (stored) {
                const content = deepMerge(defaultContent, stored);
                return new Response(JSON.stringify(content), { headers: corsHeaders });
            }
        }
        
        // Return default content
        return new Response(JSON.stringify(defaultContent), { headers: corsHeaders });
    } catch (error) {
        console.error('GET Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to load content', message: error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// PUT - Update content
export async function onRequestPut(context) {
    const { request, env } = context;
    
    try {
        const newContent = await request.json();
        
        if (!newContent || typeof newContent !== 'object') {
            return new Response(JSON.stringify({ error: 'Invalid content format' }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // Merge with defaults
        const mergedContent = deepMerge(defaultContent, newContent);
        
        // Save to KV
        if (env.CONTENT) {
            await env.CONTENT.put('portfolio-content', JSON.stringify(mergedContent));
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Content updated successfully',
            persisted: !!env.CONTENT
        }), { headers: corsHeaders });
    } catch (error) {
        console.error('PUT Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to save content', message: error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// POST - Create/Update content
export async function onRequestPost(context) {
    return onRequestPut(context);
}

// DELETE - Reset to defaults
export async function onRequestDelete(context) {
    const { env } = context;
    
    try {
        if (env.CONTENT) {
            await env.CONTENT.put('portfolio-content', JSON.stringify(defaultContent));
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Content reset to defaults'
        }), { headers: corsHeaders });
    } catch (error) {
        console.error('DELETE Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to reset content', message: error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// OPTIONS - CORS preflight
export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
