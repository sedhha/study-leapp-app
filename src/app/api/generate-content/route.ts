import { convertB64ToContent } from '@@/server/convertImageToContent';
import { NextRequest, NextResponse } from 'next/server';

let limit = 15;
const POST = async (req: NextRequest) => {
	const promptText = await req.text();
	if (limit <= 0 || typeof promptText !== 'string' || !promptText)
		return {
			questionnaire: [],
			summaryOfText: 'Unable to form content from given Image.',
		};
	limit--;
	return convertB64ToContent(promptText)
		.then((res) => NextResponse.json(res))
		.catch((err) =>
			NextResponse.json(
				{ questionnaire: [], summaryOfText: err.message },
				{
					status: 500,
					statusText: err.message,
				}
			)
		);
};

export { POST };
