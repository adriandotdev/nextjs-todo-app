import { headers } from "next/headers";
import Link from "next/link";
import React from "react";

const NotFound = async () => {
	const headersList = headers();
	const domain = headersList.get("host");

	return (
		<main className="flex justify-center items-center min-h-screen flex-col gap-3">
			<h1 className="text-3xl font-bold">404: Page Not Found</h1>
			<p>Could not find requested resource</p>
			<button className="bg-slate-900 p-3 text-gray-100 rounded-md">
				<Link href="/todo">See your To-Dos</Link>
			</button>
		</main>
	);
};

export default NotFound;
