import { NextRequest, NextResponse } from "next/server";
import UserService from "@services/UserService";
import UserRepository from "@repositories/UserRepository";
import fs from "fs/promises";
import path from "path";
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

/**
 *
 * @param {NextRequest} request
 */
// export async function POST(request) {
// 	try {
// 		// const formData = await request.formData();

// 		// const body = {
// 		// 	name: formData.get("name"),
// 		// 	username: formData.get("username"),
// 		// 	password: formData.get("password"),
// 		// 	profile_photo: Buffer.from(
// 		// 		await formData.get("profile_photo").arrayBuffer()
// 		// 	),
// 		// };
// 		const formData = await request.formData();

// 		const file = formData.get("profile_photo");
// 		if (!file) {
// 			return NextResponse.json(
// 				{ error: "No files received." },
// 				{ status: 400 }
// 			);
// 		}

// 		const buffer = Buffer.from(await file.arrayBuffer());
// 		const filename = file.name.replaceAll(" ", "_");

// 		const name =
// 			String(file.name).split(".")[0] +
// 			"-" +
// 			Date.now() +
// 			path.extname(filename);

// 		try {
// 			await fs.writeFile(
// 				path.join(process.cwd(), "assets/" + filename),
// 				buffer
// 			);
// 			return Response.json({ Message: "Success", status: 201 });
// 		} catch (error) {
// 			console.log("Error occured ", error);
// 			return Response.json({ Message: "Failed", status: 500 });
// 		}
// 	} catch (err) {
// 		return Response.json(
// 			{
// 				status: err.status || 500,
// 				data: err.data || null,
// 				message: err.message || "Internal Server Error",
// 			},
// 			{ status: err.status || 500 }
// 		);
// 	}
// }
