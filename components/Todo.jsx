import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { IconButton } from "@mui/material";
import axios from "axios";

const Todo = ({
	todo,
	setTodos,
	setDraggedElement,
	setConfirmationModal,
	setAlert,
	CloseAlert,
	setConfirmationProgress,
	setUpdateTodoModal,
	setTodoToUpdate,
}) => {
	const OnDragStart = (e) => {
		setDraggedElement(e.target);
		e.target.classList.add("opacity-50", "dragging");
	};

	const OnDragEnd = (e) => {
		setDraggedElement(null);
		e.target.classList.remove("opacity-50", "dragging");
	};

	const apiClient = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	let interceptorID;

	const DeleteTask = async (id) => {
		setConfirmationProgress(true);

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
			await apiClient.delete(`/api/todos?id=${id}`);

			const todos = await apiClient.get("/api/todos?status=pending");

			setTodos(todos.data.data);
			setConfirmationModal({
				is_visible: false,
				confirmation_message: "",
				button_confirmation_text: "",
				event: null,
			});
			setAlert({
				is_visible: true,
				message: "Task successfully deleted",
				severity: "success",
			});
			setConfirmationProgress(false);
			CloseAlert();
		} catch (err) {
			setAlert({
				is_visible: true,
				message: err.message,
				severity: "error",
			});
			CloseAlert();
		}
	};

	return (
		<div
			className={`draggable bg-white flex justify-between items-center gap-3 border border-gray-200 p-2 max-w-[30rem] w-full mt-5 cursor-move ${
				todo.priority === "low"
					? "border-l-4 border-l-yellow-500"
					: todo.priority === "medium"
					? "border-l-4 border-l-orange-500"
					: "border-l-4 border-l-red-500"
			}`}
			draggable="true"
			onDragStart={OnDragStart}
			onDragEnd={OnDragEnd}
		>
			<p className="font-semibold">{todo.title}</p>
			<section className="flex">
				<IconButton
					color="error"
					aria-label="delete"
					onClick={() => {
						setConfirmationModal({
							is_visible: true,
							confirmation_message:
								"Are you sure you want to delete this task?",
							button_confirmation_text: "Yes, remove this task",
							event: () => DeleteTask(todo.id),
							data: todo.title,
						});
					}}
				>
					<DeleteIcon />
				</IconButton>
				<IconButton
					color="primary"
					aria-label="update"
					onClick={() => {
						setUpdateTodoModal(true);
						setTodoToUpdate(todo);
					}}
				>
					<EditIcon />
				</IconButton>
				<IconButton color="success" aria-label="delete">
					<DoneIcon />
				</IconButton>
			</section>
		</div>
	);
};

export default Todo;
