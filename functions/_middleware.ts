import { CFP_ALLOWED_PATHS } from './constants';
import { getCookieKeyValue } from './utils';
import { getTemplate } from './template';

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://games.chill.ws',
    'Access-Control-Allow-Headers': 'CFP-Auth-Key, content-type',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Credentials': "true",
};

export async function onRequestOptions(context: {
    request: Request;
    next: () => Promise<Response>;
    env: { CFP_PASSWORD?: string };
}): Promise<Response> {
    return new Response(null, {
        status: 204,
        headers: {
            ...corsHeaders,
            "Content-type": "application/json",
        },
    });
}

function isPublic(pathname) {
    if (CFP_ALLOWED_PATHS.includes(pathname)) return true;
    if (pathname.startsWith('/images')) return true;
    return false;
}

export async function onRequest(context: {
    request: Request;
    next: () => Promise<Response>;
    env: { CFP_PASSWORD?: string };
}): Promise<Response> {
    const { request, next, env } = context;
    const { pathname, searchParams } = new URL(request.url);
    const { error } = Object.fromEntries(searchParams);
    const cookie = request.headers.get('cookie') || '';
    const cookieKeyValue = await getCookieKeyValue(env.CFP_PASSWORD);

    if (
        cookie.includes(cookieKeyValue) ||
        isPublic(pathname) ||
        !env.CFP_PASSWORD
    ) {
        // Correct hash in cookie, allowed path, or no password set.
        // Continue to next middleware.
        return await next();
    } else {
        // No cookie or incorrect hash in cookie. Redirect to login.
        return new Response(getTemplate({ redirectPath: pathname, withError: error === '1' }), {
            headers: {
                "Content-type": "text/html",
            }
        });
    }
}