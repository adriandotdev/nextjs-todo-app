import { HttpUnauthorized } from "@utils/HttpError";
import { verifyAccessToken, verifyRefreshToken } from "@utils/Session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param {NextRequest} request
 */
export default async function middleware(request) {
	console.log("URL: " + request.nextUrl.pathname);

	if (request.nextUrl.pathname.match(/\/todo\/*/)) {
		const result = cookies().get("session");

		if (!result || !result.value)
			return NextResponse.redirect(new URL("/signin", request.url));

		try {
			const jwt = await verifyAccessToken(
				JSON.parse(result.value).access_token
			);

			return NextResponse.next();
		} catch (err) {
			console.log("1");
			console.log(err);
			// return NextResponse.json(
			// 	{
			// 		status: err.status || 500,
			// 		data: err.data || null,
			// 		message: err.message || "Internal Server Error",
			// 	},
			// 	{ status: err.status || 500 }
			// );
			return NextResponse.redirect(new URL("/signin", request.url));
		}
	} else if (
		request.nextUrl.pathname === "/signin" ||
		request.nextUrl.pathname === "/signup"
	) {
		const result = cookies().get("session");

		if (result) {
			try {
				const jwt = await verifyAccessToken(
					JSON.parse(result.value).access_token
				);

				return NextResponse.redirect(new URL("/todo", request.url));
			} catch (err) {
				console.log("2");
				console.log(err);
				// return NextResponse.json(
				// 	{
				// 		status: err.status || 500,
				// 		data: err.data || null,
				// 		message: err.message || "Internal Server Error",
				// 	},
				// 	{ status: err.status || 500 }
				// );
				return NextResponse.next();
			}
		}

		return NextResponse.next();
	} else if (request.nextUrl.pathname === "/refresh") {
		const result = cookies().get("session");

		console.log("MIDDLEWARE REFRESH");
		if (!result || !result.value)
			return NextResponse.redirect(new URL("/signin", request.url));

		try {
			const jwt = await verifyRefreshToken(
				JSON.parse(result.value).refresh_token
			);

			return NextResponse.next();
		} catch (err) {
			console.log(err);
			return NextResponse.json(
				{
					status: err.status || 500,
					data: err.data || null,
					message: err.message || "Internal Server Error",
				},
				{ status: err.status || 500 }
			);
		}
	}
}
