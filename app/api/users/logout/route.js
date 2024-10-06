import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		cookies().delete("session");

		return NextResponse.json(
			{
				status: 200,
				data: null,
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
