"use client";

import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import AddTodoModal from "./AddTodoModal";
import Todo from "./Todo";
import axios from "axios";
import { useRouter } from "next/navigation";

const TodoList = () => {
	const router = useRouter();

	// State of list of todos
	const [todos, setTodos] = useState(() => []);

	// State for opening the AddTodoModal.
	const [modal, setModal] = useState(() => false);

	// State for knowing which todo element is dragged by the user.
	const [draggedElement, setDraggedElement] = useState(null);

	// Container of the todo to drag over.
	const container = useRef(null);

	const GetDragAfterElement = (container, y) => {
		const draggableElements = [
			...container.querySelectorAll(".draggable:not(.dragging)"),
		];

		return draggableElements.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();
				const offset = y - box.top - box.height / 2;

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{ offset: Number.NEGATIVE_INFINITY }
		).element;
	};

	const OnDragOver = (e) => {
		e.preventDefault();

		const afterElement = GetDragAfterElement(container.current, e.clientY);

		if (afterElement === null) {
			container.current.appendChild(draggedElement);
		} else {
			container.current.insertBefore(draggedElement, afterElement);
		}
	};

	const apiClient = axios.create({
		baseURL: "http://localhost:3000",
		headers: {
			"Content-Type": "application/json",
		},
	});

	useEffect(() => {
		let interceptorID;

		async function GetTodos() {
			// Add the response interceptor
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

			// Fetch todos
			try {
				const result = await apiClient.get("/api/todos");
				setTodos(result.data.data);
			} catch (todosError) {
				console.error("Error fetching todos:", todosError);
			}
		}

		GetTodos();

		// Cleanup interceptor when the component unmounts
		return () => {
			apiClient.interceptors.response.eject(interceptorID);
		};
	}, []);

	return (
		<>
			<div className="mt-5 flex gap-3 justify-between w-full max-w-[30rem]">
				<h1 className="text-3xl font-sans font-bold">My To-Do</h1>
				<IconButton
					color="primary"
					aria-label="add"
					onClick={() => setModal(true)}
				>
					<AddIcon />
				</IconButton>
			</div>
			<div
				ref={container}
				className="container max-w-[30rem]"
				onDragOver={OnDragOver}
			>
				{todos.map((todo) => (
					<Todo
						key={todo.id}
						todo={todo.title}
						setDraggedElement={setDraggedElement}
					/>
				))}
			</div>
			{modal && <AddTodoModal setModal={setModal} />}
		</>
	);
};

export default TodoList;
