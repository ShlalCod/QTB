/**
 * Cloudflare Pages Function: Media API
 * Placeholder - R2 not configured
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
};

// GET - Return empty list (R2 not configured)
export async function onRequestGet() {
    return new Response(JSON.stringify({
        success: true,
        files: [],
        message: 'Media storage not configured. Enable R2 bucket to use this feature.'
    }), { headers: corsHeaders });
}

// POST - Not available without R2
export async function onRequestPost() {
    return new Response(JSON.stringify({
        error: 'Media upload not available',
        message: 'R2 bucket not configured. Add R2 binding to enable media uploads.'
    }), {
        status: 503,
        headers: corsHeaders
    });
}

// DELETE - Not available without R2
export async function onRequestDelete() {
    return new Response(JSON.stringify({
        error: 'Media deletion not available',
        message: 'R2 bucket not configured.'
    }), {
        status: 503,
        headers: corsHeaders
    });
}

// OPTIONS - CORS preflight
export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
