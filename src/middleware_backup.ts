import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const hostProtedted = [
	'/create',
	'/events'
];

export default withAuth(
	function middleware(req) {
		if (req.nextUrl.pathname === '/auth/success' && req.nextauth.token?.user.is_host) {
			return NextResponse.redirect(new URL('/events', req.url));
		}
		NextResponse.next();
	},
	{
		callbacks: {
			authorized({ req, token }) {
				const isHostRoute = hostProtedted.includes(req.nextUrl.pathname);
				return isHostRoute ? !!token?.user?.is_host : !!token;
			},
		},
	});

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