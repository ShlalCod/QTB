/**
 * Cloudflare Pages Function: Auth API
 * Simple password verification for admin panel
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
};

// POST - Verify password
export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { password } = await request.json();
        
        // Get password from env or use default
        const adminPassword = env.ADMIN_PASSWORD || 'qtmb2024admin';
        
        if (password === adminPassword) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Authentication successful'
            }), { headers: corsHeaders });
        }
        
        return new Response(JSON.stringify({
            success: false,
            message: 'Invalid password'
        }), {
            status: 401,
            headers: corsHeaders
        });
    } catch (error) {
        console.error('Auth Error:', error);
        return new Response(JSON.stringify({ error: 'Authentication failed' }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// OPTIONS - CORS preflight
export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
