import { decrypt } from "@utils/Session";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param {NextRequest} request
 */
export default async function middleware(request) {
	console.log(request.nextUrl.pathname);
	if (request.nextUrl.pathname === "/todo") {
		const result = cookies().get("session");

		if (!result || !result.value)
			return NextResponse.redirect(new URL("/signin", request.url));

		try {
			const jwt = await decrypt(result.value);
		} catch (err) {
			return NextResponse.redirect(new URL("/signin", request.url));
		}
	} else if (
		request.nextUrl.pathname === "/signin" ||
		request.nextUrl.pathname === "/signup"
	) {
		const result = cookies().get("session");

		try {
			const jwt = await decrypt(result.value);

			return NextResponse.redirect(new URL("/todo", request.url));
		} catch (err) {}
	}
}
