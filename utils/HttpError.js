const HTTP_STATUS_CODE = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
};

class HttpError extends Error {
	constructor({ name, status, message, data }) {
		super(message);
		this.status = status;
		this.data = data;
		this.name = name;
		Error.captureStackTrace(this);
	}
}

class HttpBadRequest extends HttpError {
	constructor(message, data) {
		super({
			name: "Bad Request",
			status: HTTP_STATUS_CODE.BAD_REQUEST,
			data,
			message,
		});
	}
}

class HttpNotFound extends HttpError {
	constructor(message, data) {
		super({
			name: "Not Found",
			status: HTTP_STATUS_CODE.NOT_FOUND,
			data,
			message,
		});
	}
}

class HttpForbidden extends HttpError {
	constructor(message, data) {
		super({
			name: "Forbidden",
			status: HTTP_STATUS_CODE.FORBIDDEN,
			data,
			message,
		});
	}
}

class HttpUnprocessableEntity extends HttpError {
	constructor(message, data) {
		super({
			name: "",
			status: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
			data,
			message,
		});
	}
}

class HttpUnauthorized extends HttpError {
	constructor(message, data) {
		super({
			name: "Unauthorized",
			status: HTTP_STATUS_CODE.UNAUTHORIZED,
			data,
			message,
		});
	}
}

class HttpInternalServerError extends HttpError {
	constructor(message, data) {
		super({
			name: "Internal Server Error",
			status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
			data,
			message,
		});
	}
}

export {
	HttpError,
	HttpUnauthorized,
	HttpBadRequest,
	HttpNotFound,
	HttpForbidden,
	HttpUnprocessableEntity,
	HttpInternalServerError,
};
