import { NextRequest, NextResponse } from 'next/server';
import { HttpException } from './HttpEntities';

type NextRouteHandler = (request: NextRequest) => Promise<NextResponse>;
const withHttpExceptionHandler = (handler: NextRouteHandler) => {
	const wrappedHandler: NextRouteHandler = async (req) => {
		try {
			return await handler(req);
		} catch (error) {
			if (error instanceof HttpException) {
				return new NextResponse(error.message, {
					status: error.statusCode,
					statusText: error.statusText,
				});
			}
			throw error;
		}
	};

	return wrappedHandler;
};
export { withHttpExceptionHandler };
