import Link from "next/link";
import React from "react";

import SignInForm from "@components/SignInForm";

const SignIn = () => {
	return (
		<main className="min-h-[100vh] h-full  flex justify-center items-center">
			<div className="h-[25rem] max-w-[25rem] w-full  p-7 flex flex-col justify-center items-center">
				<h1 className="font-bold text-slate-900 text-center text-3xl md:text-3xl mb-5">
					Welcome to <span className="text-orange-400">YourToDo</span>
				</h1>

				<SignInForm />
				<div>
					<p className="font-sans text-lg mt-3">
						{"Don't have an account yet?"}{" "}
						<Link className="font-bold text-slate-950" href="/signup">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
};

export default SignIn;
