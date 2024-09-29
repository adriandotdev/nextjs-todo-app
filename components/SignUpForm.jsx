import React from "react";

const SignUpForm = () => {
	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			className="flex flex-col gap-4 w-full"
			action=""
		>
			<section className="flex flex-col gap-1">
				<label className="font-medium" htmlFor="name">
					Name
				</label>
				<input
					className="border p-2"
					type="text"
					name="name"
					id="name"
					placeholder="Please provide your name"
				/>
			</section>

			<section className="flex flex-col gap-1">
				<label className="font-medium" htmlFor="username">
					Username
				</label>
				<input
					className="border p-2"
					type="text"
					name="username"
					id="username"
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

			<section className="flex flex-col gap-1">
				<label className="font-medium" htmlFor="confirm-password">
					Confirm Password
				</label>
				<input
					className="border p-2"
					type="password"
					name="confirm-password"
					id="confirm-password"
					placeholder="Please confirm your password"
				/>
			</section>

			<input
				className="font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
				type="submit"
				value="Sign Up"
			/>
		</form>
	);
};

export default SignUpForm;
