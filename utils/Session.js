import "server-only";
import { SignJWT, jwtVerify, decodeJwt } from "jose";

const accessTokenKey = process.env.JWT_ACCESS_TOKEN_KEY;
const accessTokenEncodedKey = new TextEncoder().encode(accessTokenKey);

const refreshTokenKey = process.env.JWT_REFRESH_TOKEN_KEY;
const refreshTokenEncodedKey = new TextEncoder().encode(refreshTokenKey);

export async function generateAccessToken(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("15mins")
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
		throw error;
	}
}

export async function verifyRefreshToken(session) {
	try {
		const { payload } = await jwtVerify(session, refreshTokenEncodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		throw error;
	}
}

export async function decodeAccessToken(session) {
	try {
		const { payload } = await jwtVerify(session, accessTokenEncodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		throw error;
	}
}
