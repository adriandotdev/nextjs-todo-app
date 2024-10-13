import React from "react";
import Link from "next/link";
import SignUpForm from "@components/SignUpForm";

const SignUpPage = () => {
	return (
		<main className="min-h-[100vh]   flex justify-center items-center relative">
			<div className=" max-w-[25rem] w-full  p-7 flex flex-col justify-center items-center ">
				<h1 className="font-bold text-slate-900 text-center text-3xl md:text-3xl mb-5">
					Create Your Account
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
