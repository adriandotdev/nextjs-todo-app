import { NextRequest } from "next/server";

import ToDoService from "@services/ToDoService";
import ToDoRepository from "@repositories/ToDoRepository";
import { cookies } from "next/headers";

import { decodeAccessToken } from "@utils/Session";

const service = new ToDoService(new ToDoRepository());

/**
 *
 * @param {NextRequest} request
 */
export async function GET(request) {
	try {
		const session = cookies().get("session");

		const payload = await decodeAccessToken(
			JSON.parse(session.value).access_token
		);

		const todos = await service.GetTodosByUserId({ id: payload.data.id });

		return Response.json(
			{ status: 200, data: todos, message: "Ok" },
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
export async function POST(request) {
	try {
		const data = await request.json();

		const session = cookies().get("session");

		const payload = await decodeAccessToken(
			JSON.parse(session.value).access_token
		);

		await service.CreateToDo({ ...data, user_id: payload.data.id });

		return Response.json(
			{ status: 201, data: [], message: "Created" },
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
 * @param {NextRequest} request
 */
export async function DELETE(request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		await service.DeleteTodoByID(parseInt(id, 10));

		return Response.json(
			{ status: 200, data: [], message: "Ok" },
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
export async function PUT(request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const payload = await request.json();
		await service.UpdateTodoByID(id, payload);

		return Response.json(
			{ status: 200, data: [], message: "Ok" },
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
