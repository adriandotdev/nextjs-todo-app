"use client";
import React from "react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

const MarkdownPreview = ({ md, setPreview, noteTitle }) => {
	return (
		<div className="w-full max-w-[30rem]">
			<div className="flex">
				<h1
					name="note-title"
					id="note-title"
					className="max-w-[30rem] w-full overflow-hidden h-auto outline-none resize-none text-3xl font-bold max-h-[2rem] text-slate-900"
				>
					{noteTitle}
				</h1>
				<button className="primary-btn" onClick={() => setPreview(false)}>
					Edit
				</button>
			</div>
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
								marginTop: "1rem",
							}}
							{...props}
						/>
					),
					p: ({ node, ...props }) => (
						<p
							style={{
								padding: 0,
								margin: 0,
								marginTop: "0.5rem",
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
					li: ({ node, ...props }) => (
						<li
							style={{
								margin: 0,
								maxHeight: "24px",
								height: "100%",
								marginTop: "0.5rem",
							}}
							{...props}
						/>
					),
					ol: ({ node, ...props }) => (
						<ol
							style={{
								listStyle: "number",
								paddingLeft: "2rem",
								margin: 0,
							}}
							{...props}
						/>
					),
				}}
				remarkPlugins={[remarkBreaks]}
			>
				{md}
			</Markdown>
		</div>
	);
};

export default MarkdownPreview;
