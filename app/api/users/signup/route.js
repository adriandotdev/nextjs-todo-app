import { NextRequest, NextResponse } from "next/server";
import UserService from "@services/UserService";
import UserRepository from "@repositories/UserRepository";

const service = new UserService(new UserRepository());
/**
 *
 * @param {NextRequest} request
 */
export async function POST(request) {
	try {
		const body = await request.json();

		await service.CreateUser({
			name: body.name,
			username: body.username,
			password: body.password,
		});

		return NextResponse.json(
			{ status: 201, data: [], message: "Ok" },
			{ status: 201 }
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
