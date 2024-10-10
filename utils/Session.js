import "server-only";
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { HttpUnauthorized } from "./HttpError";

const accessTokenKey = process.env.JWT_ACCESS_TOKEN_KEY;
const accessTokenEncodedKey = new TextEncoder().encode(accessTokenKey);

const refreshTokenKey = process.env.JWT_REFRESH_TOKEN_KEY;
const refreshTokenEncodedKey = new TextEncoder().encode(refreshTokenKey);

export async function generateAccessToken(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("8sec")
		.sign(accessTokenEncodedKey);
}

export async function generateRefreshToken(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1hr")
		.sign(refreshTokenEncodedKey);
}

export async function verifyAccessToken(session) {
	try {
		const { payload } = await jwtVerify(session, accessTokenEncodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		throw new HttpUnauthorized("INVALID_JWT_ACCESS_TOKEN", {
			message: "Invalid access token",
		});
	}
}

export async function verifyRefreshToken(session) {
	try {
		const { payload } = await jwtVerify(session, refreshTokenEncodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		throw new HttpUnauthorized("INVALID_JWT_REFRESH_TOKEN", {
			message: "Invalid refresh token",
		});
	}
}

export async function decodeAccessToken(session) {
	try {
		const { payload } = await jwtVerify(session, accessTokenEncodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		throw new HttpUnauthorized("INVALID_JWT_ACCESS_TOKEN", {
			message: "Invalid access token",
		});
	}
}

export async function decodeRefreshToken(session) {
	try {
		const { payload } = await jwtVerify(session, refreshTokenEncodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		throw new HttpUnauthorized("INVALID_JWT_REFRESH_TOKEN", {
			message: "Invalid refresh token",
		});
	}
}
