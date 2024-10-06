import { NextRequest, NextResponse } from "next/server";
import UserService from "@services/UserService";
import UserRepository from "@repositories/UserRepository";
import { cookies } from "next/headers";

const service = new UserService(new UserRepository());

/**
 *
 * @param {NextRequest} request
 */
export async function POST(request) {
	const body = await request.json();

	try {
		const result = await service.SignIn({
			username: body.username,
			password: body.password,
		});

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		cookies().set("session", result, {
			httpOnly: true,
			secure: true,
			expires: expiresAt,
			sameSite: "lax",
			path: "/",
		});

		return NextResponse.json(
			{
				status: 200,
				data: result,
				message: "Ok",
			},
			{ status: 200 }
		);
	} catch (err) {
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
