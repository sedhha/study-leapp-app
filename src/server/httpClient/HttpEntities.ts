class HttpException extends Error {
	statusCode: number;
	statusText: string;
	constructor(statusText: string, statusCode: number) {
		super(statusText);
		this.statusCode = statusCode;
		this.statusText = statusText;
	}
}

const HttpStatus = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	// Add more status codes as needed
};

export { HttpException, HttpStatus };
