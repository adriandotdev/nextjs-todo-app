"use client";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

const NotesPage = () => {
	const [md, setMD] = useState(``);
	const textArea = useRef(null);

	const markdown = "# Hi, *Pluto*!";

	const handleInput = (e) => {
		// Capture the HTML content
		let content = e.target.value;

		const format = content.replace(/\n/gi, "\n &nbsp; \n");

		// Update state
		setMD(format);
	};
	return (
		<>
			<div className="overflow-y-auto">
				<textarea
					ref={textArea}
					name="markdown"
					id="markdown"
					className="w-full overflow-x-hidden h-auto min-h-[80vh] outline-none resize-none px-5 py-3 leading-8"
					placeholder="Create your notes"
					onChange={handleInput}
					onKeyDown={(e) => {
						if (e.key === "Tab") {
							e.preventDefault();
							const newValue = md + "    ";

							setMD(newValue);
						}
					}}
				></textarea>
				<div className="px-5 py-3">
					<Markdown
						components={{
							h1: ({ node, ...props }) => (
								<h1
									style={{
										color: "black",
										fontSize: "1.5rem",
										fontWeight: "bold",
										padding: 0,
										margin: 0,
									}}
									{...props}
								/>
							),
							p: ({ node, ...props }) => (
								<p
									style={{
										padding: 0,
										margin: 0,
									}}
									{...props}
								/>
							),
							ul: ({ node, ...props }) => (
								<ul
									style={{
										listStyle: "disc",
										paddingLeft: "2rem",
										margin: 0,
									}}
									{...props}
								/>
							),
						}}
						remarkPlugins={[remarkBreaks]}
					>
						{md.replace(/ {4}/g, "    ")}
					</Markdown>
				</div>
			</div>
		</>
	);
};

export default NotesPage;
