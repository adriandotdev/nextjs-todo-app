"use client";

import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import AddTodoModal from "./AddTodoModal";
import Todo from "./Todo";
import axios from "axios";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import CustomAlert from "./CustomAlert";
import Image from "next/image";
import AllDoneLogo from "../assets/images/all_done.png";
import UpdateTodoModal from "./UpdateTodoModal";

const TodoList = () => {
	const router = useRouter();

	// State for ConfirmationModal.jsx
	const [confirmationModal, setConfirmationModal] = useState({
		is_visible: false,
		confirmation_message: "",
		button_confirmation_text: "",
		event: null,
		data: null,
	});
	const [isConfirmationProgress, setConfirmationProgress] = useState(
		() => false
	);

	// State for Alert
	const [alert, setAlert] = useState(() => ({
		is_visible: false,
		message: "",
		severity: "",
	}));

	// State of list of todos
	const [todos, setTodos] = useState(() => []);

	// State for opening the AddTodoModal.
	const [addTodoModal, setAddTodoModal] = useState(() => false);

	// State for opening UpdateTodoModal
	const [updateTodoModal, setUpdateTodoModal] = useState(() => false);
	const [todoToUpdate, setTodoToUpdate] = useState(() => undefined);

	// State for fetching data
	const [isFetchingTodo, setFetchingTodo] = useState(() => true);

	// State for knowing which todo element is dragged by the user.
	const [draggedElement, setDraggedElement] = useState(null);

	// State for tabs
	const [tabs, setTabs] = useState(() => [
		{
			tabName: "Pending",
			active: true,
			event: () => {
				setTabs(
					tabs.map((tab) => {
						if (tab.tabName === "Pending") {
							return {
								...tab,
								active: true,
							};
						}
						return {
							...tab,
							active: false,
						};
					})
				);

				GetTodos("pending");
			},
		},
		{
			tabName: "Completed",
			active: false,
			event: () => {
				setTabs(
					tabs.map((tab) => {
						if (tab.tabName === "Completed") {
							return {
								...tab,
								active: true,
							};
						}
						return {
							...tab,
							active: false,
						};
					})
				);
				GetTodos("completed");
			},
		},
	]);

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

	const apiClient = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	let interceptorID;

	async function GetTodos(status) {
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
			const result = await apiClient.get(`/api/todos?status=${status}`);
			setTodos(result.data.data);
			setFetchingTodo(false);
		} catch (todosError) {
			console.error("Error fetching todos:", todosError);
		}
	}

	useEffect(() => {
		setFetchingTodo(true);

		GetTodos("pending");

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
					onClick={() => setAddTodoModal(true)}
				>
					<AddIcon />
				</IconButton>
			</div>

			<div
				role="tablist"
				className="tabs tabs-lifted w-full max-w-[30rem] mt-5"
			>
				{tabs.map((tab) => (
					<a
						role="tab"
						className={`tab font-bold ${tab.active && "tab-active"}`}
						onClick={tab.event}
					>
						{tab.tabName}
					</a>
				))}
			</div>
			<div
				ref={container}
				className="container max-w-[30rem] pb-5"
				onDragOver={OnDragOver}
			>
				{isFetchingTodo ? (
					<section className="flex flex-col gap-3 mt-5">
						{[1, 2, 3].map((value) => (
							<div
								key={value}
								className="skeleton w-full h-[4rem] flex justify-between items-center px-5 "
							>
								<div className="skeleton w-[3rem] h-[1rem] bg-gray-400"></div>
								<div className="flex gap-3">
									<div className="w-[2rem] h-[2rem] rounded-full skeleton bg-gray-400"></div>
									<div className="w-[2rem] h-[2rem] rounded-full skeleton bg-gray-400"></div>
									<div className="w-[2rem] h-[2rem] rounded-full skeleton bg-gray-400"></div>
								</div>
							</div>
						))}
					</section>
				) : !todos.length ? (
					<div className="flex justify-center">
						<Image
							src={AllDoneLogo}
							width={250}
							height={250}
							alt="Picture of the author"
						/>
					</div>
				) : (
					todos.map((todo) => (
						<Todo
							key={todo.id}
							todo={todo}
							setTodos={setTodos}
							setDraggedElement={setDraggedElement}
							setConfirmationModal={setConfirmationModal}
							setAlert={setAlert}
							CloseAlert={CloseAlert}
							setConfirmationProgress={setConfirmationProgress}
							setUpdateTodoModal={setUpdateTodoModal}
							setTodoToUpdate={setTodoToUpdate}
						/>
					))
				)}
			</div>
			{addTodoModal && (
				<AddTodoModal
					setModal={setAddTodoModal}
					setTodos={setTodos}
					tabs={tabs}
					setTabs={setTabs}
				/>
			)}
			{updateTodoModal && (
				<UpdateTodoModal
					setModal={setUpdateTodoModal}
					setTodos={setTodos}
					todoToUpdate={todoToUpdate}
				/>
			)}
			{confirmationModal.is_visible && (
				<ConfirmationModal
					confirmationModal={confirmationModal}
					setConfirmationModal={setConfirmationModal}
					event={confirmationModal.event}
					isConfirmationProgress={isConfirmationProgress}
				/>
			)}
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

export default TodoList;
