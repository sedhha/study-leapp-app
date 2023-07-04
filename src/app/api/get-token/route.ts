import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@@/config/config';
import { cookies } from 'next/headers';
import { withHttpExceptionHandler } from '@@/server/httpClient/withHttpHandler';

const getToken = async (_: NextRequest): Promise<NextResponse> => {
	const expiration = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
	const token = jwt.sign({ exp: expiration }, config.JWT_SECRET);
	const cookieStore = cookies();
	cookieStore.set('x-study-leap-access-token', token, {
		expires: expiration,
	});
	return NextResponse.json(
		{ token },
		{
			status: 200,
			headers: {
				'Set-Cookie': `x-study-leap-access-token=${token}; Max-Age=300; HttpOnly=true`,
			},
		}
	);
};

const GET = withHttpExceptionHandler(getToken);
export { GET };
