/**
 * Cloudflare Pages Function: Media API
 * Handles file uploads and management for Cloudflare R2
 * Stores images, videos, and other media files
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
};

const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Generate unique filename
function generateFilename(originalName) {
    const ext = originalName.split('.').pop() || 'bin';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}.${ext}`;
}

// GET - List media files
export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        if (!env.MEDIA) {
            return new Response(JSON.stringify({
                error: 'R2 bucket not configured',
                files: []
            }), { headers: corsHeaders });
        }
        
        const objects = await env.MEDIA.list();
        const files = objects.objects.map(obj => ({
            key: obj.key,
            size: obj.size,
            uploaded: obj.uploaded,
            url: `/api/media/${obj.key}`
        }));
        
        return new Response(JSON.stringify({
            success: true,
            files,
            count: files.length
        }), { headers: corsHeaders });
    } catch (error) {
        console.error('GET Media Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to list files', files: [] }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// POST - Upload file
export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        if (!env.MEDIA) {
            return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
                status: 500,
                headers: corsHeaders
            });
        }
        
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return new Response(JSON.stringify({
                error: 'File type not allowed',
                allowedTypes: ALLOWED_TYPES
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return new Response(JSON.stringify({
                error: 'File too large',
                maxSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // Generate filename and upload
        const filename = generateFilename(file.name);
        const arrayBuffer = await file.arrayBuffer();
        
        await env.MEDIA.put(filename, arrayBuffer, {
            httpMetadata: {
                contentType: file.type
            },
            customMetadata: {
                originalName: file.name,
                uploadedAt: new Date().toISOString()
            }
        });
        
        return new Response(JSON.stringify({
            success: true,
            message: 'File uploaded successfully',
            file: {
                key: filename,
                originalName: file.name,
                size: file.size,
                type: file.type,
                url: `/api/media/${filename}`
            }
        }), { headers: corsHeaders });
    } catch (error) {
        console.error('POST Media Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to upload file', message: error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// DELETE - Delete file
export async function onRequestDelete(context) {
    const { request, env } = context;
    
    try {
        if (!env.MEDIA) {
            return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
                status: 500,
                headers: corsHeaders
            });
        }
        
        const url = new URL(request.url);
        const key = url.searchParams.get('key');
        
        if (!key) {
            return new Response(JSON.stringify({ error: 'No file key provided' }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        await env.MEDIA.delete(key);
        
        return new Response(JSON.stringify({
            success: true,
            message: 'File deleted successfully'
        }), { headers: corsHeaders });
    } catch (error) {
        console.error('DELETE Media Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete file' }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// OPTIONS - CORS preflight
export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
