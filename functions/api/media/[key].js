/**
 * Cloudflare Pages Function: Media File Serving
 * Serves individual media files from R2 bucket
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

// GET - Serve file
export async function onRequestGet(context) {
    const { env, params } = context;
    const key = params.key;
    
    try {
        if (!env.MEDIA) {
            return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const object = await env.MEDIA.get(key);
        
        if (!object) {
            return new Response('File not found', {
                status: 404,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
        
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000');
        headers.set('Access-Control-Allow-Origin', '*');
        
        return new Response(object.body, { headers });
    } catch (error) {
        console.error('Media Serve Error:', error);
        return new Response('Error serving file', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// OPTIONS - CORS preflight
export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
