"use client";

import React from "react";
import axios from "axios";

const SignInForm = () => {
	const SignIn = async (e) => {
		e.preventDefault();

		const data = await axios.get("/api/users");

		console.log(data);
	};

	return (
		<form onSubmit={SignIn} className="flex flex-col gap-4 w-full" action="">
			<section className="flex flex-col gap-1">
				<label className="font-medium" htmlFor="name">
					Username
				</label>
				<input
					className="border p-2"
					type="text"
					name="name"
					id="name"
					placeholder="Please provide your username"
				/>
			</section>

			<section className="flex flex-col gap-1">
				<label className="font-medium" htmlFor="password">
					Password
				</label>
				<input
					className="border p-2"
					type="password"
					name="password"
					id="password"
					placeholder="Please provide your password"
				/>
			</section>

			<input
				className="font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
				type="submit"
				value="Sign In"
			/>
		</form>
	);
};

export default SignInForm;
