import { NextRequest, NextResponse } from "next/server";
import { CreateUser, GetUsers } from "../repositories/UserRepository";

export async function GET() {
	try {
		const result = await GetUsers();

		return NextResponse.json(
			{ status: 200, data: result, message: "OK" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.error().json({
			status: 500,
			data: null,
			message: "Internal Server Error",
		});
	}
}

/**
 *
 * @param {NextRequest} request
 */
export async function POST(request) {
	try {
		const body = await request.json();

		await CreateUser({
			name: body.name,
			username: body.username,
			password: body.password,
		});

		return NextResponse.json(
			{ status: 201, data: body, message: "Ok" },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.error().json({
			status: 500,
			data: null,
			message: "Internal Server Error",
		});
	}
}
