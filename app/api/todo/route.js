import { NextRequest } from "next/server";

/**
 * @param {NextRequest} request
 */
export async function POST(request) {
	try {
		const data = await request.json();

		return Response.json(
			{ status: 201, data: [], message: "Ok" },
			{ status: 201 }
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
