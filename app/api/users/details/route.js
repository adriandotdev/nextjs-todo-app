import UserRepository from "@repositories/UserRepository";
import UserService from "@services/UserService";
import { decodeAccessToken } from "@utils/Session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

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

		const publicID = await service.GetProfilePhotoPublicIDByUserID(
			payload.data.id
		);

		const result = await cloudinary.v2.api.delete_resources([publicID]);

		console.log("CLOUDINARY DELETE RESULT");
		console.log(result);

		await service.UpdateProfilePhotoByUserID(
			payload.data.id,
			data.profile_photo_url,
			data.public_id
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
		console.log(err);
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
