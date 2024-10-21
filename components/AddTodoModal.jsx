"use client";

import { CircularProgress, IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import axios from "axios";
import CustomAlert from "./CustomAlert";

const AddTodoModal = ({ setModal, setTodos }) => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	const [alert, setAlert] = useState(() => ({
		is_visible: false,
		message: "",
		severity: "",
	}));

	let interceptorID;

	const apiClient = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

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

	const AddNewTodo = async (data) => {
		interceptorID = apiClient.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				const originalRequest = error.config;

				if (
					error.response &&
					error.response.status === 401 &&
					!originalRequest._retry
				) {
					originalRequest._retry = true;

					try {
						const result = await axios.get("/api/refresh");

						if (result.status === 200)
							// Retry the original request with refreshed token
							return apiClient(originalRequest);
						else {
							// If refresh fails, redirect to the sign-in page
							await axios.get("/api/users/logout");
							router.push("/signin");
							return Promise.reject(new Error("Token refresh failed"));
						}
					} catch (refreshError) {
						// In case of refresh failure, redirect to sign-in page and reject
						await axios.get("/api/users/logout");
						router.push("/signin");
						return Promise.reject(refreshError);
					}
				}

				// For other types of errors, reject the promise as usual
				return Promise.reject(error);
			}
		);

		try {
			const result = await apiClient.post("/api/todos", data);
			const todos = await apiClient.get("/api/todos");

			setTodos(todos.data.data);
			setAlert({
				is_visible: true,
				message: "Successfully added new To-Do",
				severity: "success",
			});
			reset();
			CloseAlert();
		} catch (todosError) {
			console.error("Error creating new todo:", todosError);
		}
	};

	const CloseModal = (e) => {
		e.stopPropagation();

		setModal(false);
	};

	return (
		<div
			className="bg-black bg-opacity-20 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-end lg:items-center"
			onClick={CloseModal}
		>
			<div
				className="lg:max-w-[25rem] w-full p-3 bg-white rounded-md"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between">
					<h1 className="font-bold text-xl lg:text-2xl xl:text-2xl">
						What's your new To-Do?
					</h1>
					<IconButton
						color="error"
						aria-label="close"
						onClick={() => setModal(false)}
					>
						<CloseIcon />
					</IconButton>
				</div>

				<form
					onSubmit={handleSubmit(AddNewTodo)}
					className="flex flex-col gap-4 w-full mt-3"
				>
					<section className="flex flex-col gap-1">
						<label className="font-medium" htmlFor="title">
							Title
						</label>
						<input
							{...register("title", {
								required: "Please provide a title",
								maxLength: {
									value: 25,
									message: "Title must be maximum of 8 characters",
								},
							})}
							className={`input input-bordered ${
								errors.title?.message ? "input-error" : "input input-bordered"
							}`}
							type="text"
							name="title"
							id="title"
							placeholder="Ex. wash the dishes"
						/>
						{errors.title?.message && (
							<small className={errors.title?.message && "text-red-500"}>
								{errors.title?.message}
							</small>
						)}
					</section>

					<section className="flex flex-col gap-1">
						<label className="font-medium" htmlFor="priority">
							Priority Level
						</label>

						<select
							{...register("priority", { required: true })}
							className="select select-bordered p-2"
							name="priority"
							id="priority"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</section>

					<button
						disabled={isSubmitting}
						className="btn font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
					>
						{isSubmitting ? <CircularProgress size={"1em"} /> : "Add"}
					</button>
				</form>
			</div>

			{alert.is_visible && (
				<CustomAlert
					is_visible={alert.is_visible}
					message={alert.message}
					severity={alert.severity}
				/>
			)}
		</div>
	);
};

export default AddTodoModal;
