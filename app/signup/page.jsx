"use client";

import React from "react";
import Link from "next/link";
import SignUpForm from "@components/SignUpForm";

const SignUpPage = () => {
	return (
		<main className="min-h-[100vh] h-full  flex justify-center items-center">
			<div className="h-[25rem] max-w-[25rem] w-full  p-7 flex flex-col justify-center items-center">
				<h1 className="font-bold text-slate-900 text-3xl md:text-5xl mb-4">
					Sign Up
				</h1>
				<SignUpForm />
				<div>
					<p className="font-sans text-lg mt-3">
						{"Already have an account? "}

						<Link href="/signin" className="font-bold text-slate-950">
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
};

export default SignUpPage;
