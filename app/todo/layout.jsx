"use client";

import TodoNavigation from "@components/TodoNavigation";
import { SessionProvider } from "@contexts/SessionContext";
import React from "react";

const TodoLayout = ({ children }) => {
	return (
		<>
			<SessionProvider>
				<nav className="bg-slate-900">
					<TodoNavigation />
				</nav>
				<main>{children}</main>
			</SessionProvider>
		</>
	);
};

export default TodoLayout;
