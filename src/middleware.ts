import { NextRequest, NextResponse } from 'next/server';
enum MiddlewareRoutes {
	GET_TOKEN = '/api/get-token',
}

const middlewareHandler = async (
	route: MiddlewareRoutes,
	request: NextRequest,
	response: NextResponse
): Promise<NextResponse> => {
	switch (route) {
		case MiddlewareRoutes.GET_TOKEN: {
			return response;
		}
		default: {
			return response;
		}
	}
};

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const newResponse = await middlewareHandler(
		(request?.nextUrl?.pathname ?? '') as MiddlewareRoutes,
		request,
		response
	);
	return newResponse;
}

export const config = {
	matcher: ['/api/:path*'],
};
