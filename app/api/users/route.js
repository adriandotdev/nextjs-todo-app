import { NextRequest, NextResponse } from "next/server";
import { GetUsers } from "../repositories/UserRepository";

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
	const data = await request.json();

	return NextResponse.json({
		status: 200,
		data: "Sample POST request",
		message: "OK",
	});
}
