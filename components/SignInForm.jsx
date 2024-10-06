"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomAlert from "./CustomAlert";

const SignInForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	const router = useRouter();

	const [alert, setAlert] = useState(() => ({
		is_visible: false,
		message: "",
		severity: "",
	}));

	let timeout = useRef(null);

	const CloseAlert = () => {
		if (timeout.current) {
			clearTimeout(timeout.current);
		}

		timeout.current = setTimeout(() => {
			setAlert({
				is_visible: false,
				message: "",
				severity: "error",
			});
			timeout.current = null;
		}, 1500);
	};

	const SignIn = async (data) => {
		try {
			const result = await axios.post("/api/users/signin", {
				username: data.username,
				password: data.password,
			});

			if (result.status === 200) {
				setAlert({
					is_visible: true,
					message: "Logged in successfully!",
					severity: "success",
				});

				CloseAlert();
				reset();

				if (result.status === 200) router.push("/todo/list");
			}
		} catch (err) {
			if (err.status !== 200) {
				setAlert({
					is_visible: true,
					message: err.response.data.data?.message || "Server Error",
					severity: "error",
				});

				CloseAlert();
			}
			return;
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(SignIn)}
				className="flex flex-col gap-4 w-full"
				action=""
			>
				<section className="flex flex-col gap-1">
					<label className="font-medium" htmlFor="username">
						Username
					</label>
					<input
						{...register("username", {
							required: "Please provide your username",
						})}
						className={`p-2 border ${
							errors.username?.message
								? "border-red-500 outline-red-500"
								: "border outline-black"
						}`}
						type="text"
						name="username"
						id="username"
						placeholder="Please provide your username"
					/>
					{errors.username?.message && (
						<small className={errors.username?.message && "text-red-500"}>
							{errors.username?.message}
						</small>
					)}
				</section>

				<section className="flex flex-col gap-1">
					<label className="font-medium" htmlFor="password">
						Password
					</label>
					<input
						{...register("password", {
							required: "Please provide your password",
						})}
						className={`p-2 border ${
							errors.username?.message
								? "border-red-500 outline-red-500"
								: "border outline-black"
						}`}
						type="password"
						name="password"
						id="password"
						placeholder="Please provide your password"
					/>
					{errors.password?.message && (
						<small className={errors.password?.message && "text-red-500"}>
							{errors.password?.message}
						</small>
					)}
				</section>

				<button
					disabled={isSubmitting}
					className="font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
				>
					{isSubmitting ? <CircularProgress size="1em" /> : "Sign In"}
				</button>
			</form>
			{alert.is_visible && (
				<CustomAlert
					is_visible={alert.is_visible}
					message={alert.message}
					severity={alert.severity}
				/>
			)}
		</>
	);
};

export default SignInForm;
