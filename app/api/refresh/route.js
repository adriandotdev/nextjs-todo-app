import { HttpUnauthorized } from "@utils/HttpError";
import {
	generateAccessToken,
	generateRefreshToken,
	decodeRefreshToken,
} from "@utils/Session";
import { cookies } from "next/headers";

export async function GET() {
	try {
		const payload = cookies().get("session");

		if (!payload)
			throw new HttpUnauthorized("REFRESH_TOKEN_NOT_FOUND", {
				message: "Session not found",
			});

		const decodedRefreshToken = await decodeRefreshToken(
			JSON.parse(payload.value).refresh_token
		);

		const data = {
			username: decodedRefreshToken.data.username,
			id: decodedRefreshToken.data.id,
		};

		const access_token = await generateAccessToken({ data });
		const refresh_token = await generateRefreshToken({ data });

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		cookies().delete("session");
		cookies().set("session", JSON.stringify({ access_token, refresh_token }), {
			httpOnly: true,
			secure: true,
			expires: expiresAt,
			sameSite: "lax",
			path: "/",
		});

		return Response.json(
			{ status: 200, data: { access_token, refresh_token }, message: "Ok" },
			{ status: 200 }
		);
	} catch (err) {
		return Response.json(
			{
				status: err.status || 500,
				data: err.data || null,
				message: err.message || "Internal Server Error",
			},
			{ status: err.status || 500 }
		);
	}
}
