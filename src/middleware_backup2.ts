import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const hostProtedted = [
	'/create',
	'/events'
];

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET
	});
	const isHostRoute = hostProtedted.includes(request.nextUrl.pathname);

	if (!token) {
		return NextResponse.redirect(new URL('/auth', request.url));
	}

	if (request.nextUrl.pathname === '/auth/success' && token?.user.is_host) {
		return NextResponse.redirect(new URL('/events', request.url));
	}

	if (isHostRoute && !token?.user.is_host) {
		return NextResponse.redirect(new URL('/auth', request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/events',
		'/events/:code/cancel',
		'/events/:code/edit',
		'/events/:code/guests',
		'/events/:code/invite',
		'/events/:code/preview',
		'/events/:code/publish',
		'/events/:code/questionnaire',
		'/events/:code/success',
		'/create',
		'/auth/success',
		'/mutuals'
	]
};