"use client";

import { useForm } from "react-hook-form";

import React, { useRef, useState } from "react";

import CustomAlert from "./CustomAlert";

import axios from "axios";

import { CircularProgress } from "@mui/material";

import { useFormStatus } from "react-dom";

const SignUpForm = () => {
	const pending = useFormStatus();
	const [loading, setLoading] = useState(() => false);
	const [alert, setAlert] = useState(() => ({
		is_visible: false,
		message: "",
		severity: "",
	}));

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
		reset,
	} = useForm();

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

	const SignUp = async (data) => {
		try {
			const result = await axios.post("/api/users/signup", {
				name: data.name,
				username: data.username,
				password: data.password,
			});

			if (result.status === 201) {
				setAlert({
					is_visible: true,
					message: "Successfully registered!",
					severity: "success",
				});

				CloseAlert();
				reset();
			}
		} catch (err) {
			console.log(err);
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

	const password = watch("password");

	return (
		<>
			<form
				onSubmit={handleSubmit(SignUp)}
				className="flex flex-col gap-4 w-full"
				action=""
			>
				<section className="flex flex-col gap-1">
					<label className="font-medium" htmlFor="name">
						Name
					</label>
					<input
						className={`p-2 border ${
							errors.name?.message
								? "border-red-500 outline-red-500"
								: "border outline-black"
						}`}
						type="text"
						name="name"
						id="name"
						placeholder="Please provide your name"
						{...register("name", { required: "Please provide your name" })}
					/>
					{errors.name?.message && (
						<small className={errors.name?.message && "text-red-500"}>
							{errors.name?.message}
						</small>
					)}
				</section>

				<section className="flex flex-col gap-1">
					<label className="font-medium" htmlFor="username">
						Username
					</label>
					<input
						className={`p-2 border ${
							errors.username?.message
								? "border-red-500 outline-red-500"
								: "border outline-black"
						}`}
						type="text"
						name="username"
						id="username"
						placeholder="Please provide your username"
						{...register("username", {
							required: "Please provide your username",
							minLength: {
								value: 8,
								message: "Username must be atleast eight (8) characters long",
							},
						})}
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
						className={`p-2 border ${
							errors.password?.message
								? "border-red-500 outline-red-500"
								: "border outline-black"
						}`}
						type="password"
						name="password"
						id="password"
						placeholder="Please provide your password"
						{...register("password", {
							required: "Please provide your password",
							minLength: {
								value: 8,
								message: "Password must be atleast eight (8) characters long",
							},
						})}
					/>
					{errors.password?.message && (
						<small className={errors.password?.message && "text-red-500"}>
							{errors.password?.message}
						</small>
					)}
				</section>

				<section className="flex flex-col gap-1">
					<label className="font-medium" htmlFor="confirm-password">
						Confirm Your Password
					</label>
					<input
						className={`p-2 border ${
							errors.confirmPassword?.message
								? "border-red-500 outline-red-500"
								: "border outline-black"
						}`}
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						placeholder="Please confirm your password"
						{...register("confirmPassword", {
							required: "Please confirm your password",
							validate: (value) =>
								value === password || "Password do not match",
						})}
					/>
					{errors.confirmPassword?.message && (
						<small
							className={errors.confirmPassword?.message && "text-red-500"}
						>
							{errors.confirmPassword?.message}
						</small>
					)}
				</section>

				<button
					disabled={isSubmitting}
					className="font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
				>
					{isSubmitting ? <CircularProgress size={"1em"} /> : "Sign Up"}
				</button>

				{/* <input
					className="font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
					type="submit"
					value="Sign Up"
				/> */}
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

export default SignUpForm;
