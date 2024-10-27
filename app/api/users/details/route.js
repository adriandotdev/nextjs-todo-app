import UserRepository from "@repositories/UserRepository";
import UserService from "@services/UserService";
import { decodeAccessToken } from "@utils/Session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const service = new UserService(new UserRepository());

export async function GET() {
	try {
		const session = cookies().get("session");

		const payload = await decodeAccessToken(
			JSON.parse(session.value).access_token
		);

		const result = await service.GetUserDetailsByID(payload.data.id);

		return Response.json(
			{
				status: 200,
				data: result,
				message: "Ok",
			},
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

/**
 *
 * @param {NextRequest} request
 */
export async function PUT(request) {
	try {
		const data = await request.json();

		const session = cookies().get("session");

		const payload = await decodeAccessToken(
			JSON.parse(session.value).access_token
		);

		const result = await service.UpdateUserDetailsByID({
			name: data.name,
			username: data.username,
			password: data.password,
			current_password: data.current_password,
			id: payload.data.id,
		});

		return Response.json(
			{
				status: 200,
				data: result,
				message: "Ok",
			},
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

/**
 *
 * @param {NextRequest} request
 */
export async function DELETE(request) {
	try {
		const session = cookies().get("session");

		const payload = await decodeAccessToken(
			JSON.parse(session.value).access_token
		);

		await service.DeleteUserAccountByID(payload.data.id);

		cookies().delete("session");

		return Response.json(
			{
				status: 200,
				data: [],
				message: "Ok",
			},
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

/**
 * @param {NextRequest} request
 */
export async function PATCH(request) {
	try {
		const data = await request.json();

		const session = cookies().get("session");

		const payload = await decodeAccessToken(
			JSON.parse(session.value).access_token
		);

		await service.UpdateProfilePhotoByUserID(
			payload.data.id,
			data.profile_photo_url
		);

		return Response.json(
			{
				status: 200,
				data: [],
				message: "Ok",
			},
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
