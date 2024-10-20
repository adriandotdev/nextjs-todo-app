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
