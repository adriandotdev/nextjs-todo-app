/**
 * @About
 * This page is for the Notes page editor.
 */
"use client";

import MarkdownPreview from "@components/MarkdownPreview";
import React, { useEffect, useRef, useState } from "react";

const NotesPage = () => {
	const [isPreview, setPreview] = useState(() => false);

	const [noteTitle, setNoteTitle] = useState(() => ``);
	const [md, setMD] = useState(() => ``);
	const [originalMD, setOriginalMD] = useState(() => ``); // Markdown text without modifying 'new line'

	const noteTitleTextArea = useRef(null);
	const markdownTextArea = useRef(null);

	const handleOnChangeOnNoteTitle = (e) => {
		let content = e.target.value;

		setNoteTitle(content);
	};

	const handleOnChangeOnMarkdownTextArea = (e) => {
		// Capture the HTML content
		let content = e.target.value;

		// const format = content.replace(/\n/gi, "\n &nbsp; \n");
		// Update state
		setMD(content);
		setOriginalMD(content);
	};

	useEffect(() => {
		console.log(md);
		console.log(originalMD);
	}, [isPreview]);
	return (
		<>
			<div className="overflow-y-auto px-5 py-3 flex justify-center flex-col items-center">
				{!isPreview ? (
					<>
						<div className="w-full max-w-[30rem]">
							<div className="flex justify-between">
								<textarea
									ref={noteTitleTextArea}
									name="note-title"
									id="note-title"
									placeholder="Title"
									className="max-w-[30rem] w-full overflow-hidden h-auto outline-none resize-none text-3xl font-bold max-h-[2.5rem] text-slate-900"
									onChange={handleOnChangeOnNoteTitle}
									value={noteTitle}
								></textarea>
								{noteTitle && originalMD && (
									<button
										className="primary-btn"
										onClick={() => setPreview(true)}
									>
										Preview
									</button>
								)}
							</div>
						</div>
						<div
							contentEditable="true"
							ref={markdownTextArea}
							name="markdown"
							id="markdown"
							className="max-w-[30rem] w-full overflow-x-hidden h-auto min-h-[80vh] outline-none resize-none leading-8 pt-5"
							placeholder="Create your notes"
							onChange={handleOnChangeOnMarkdownTextArea}
							onKeyDown={(e) => {
								// if (e.key === "Tab") {
								// 	e.preventDefault();
								// 	const newValue = md + "    ";
								// 	setMD(newValue);
								// }
							}}
							onInput={handleOnChangeOnMarkdownTextArea}
							value={originalMD}
						></div>

						<div className="fixed bg-slate-900 text-white bottom-5 max-w-[25rem] w-full py-3 px-5 rounded-md flex gap-5">
							<button
								className="bg-slate-100 text-black py-2 px-3 rounded-full font-bold"
								onClick={() => {
									const block = document.createElement("h1");

									block.classList.add("note-heading1");
									block.setAttribute("contenteditable", "true");
									block.setAttribute("data-placeholder", "Heading 1");
									block.textContent = "Heading 1";
									block.addEventListener("input", function () {
										if (block.innerText.trim().length > 0) {
											block.classList.add("has-content");
										} else {
											block.classList.remove("has-content");
										}
									});

									// Not working (Needs improvement)
									block.addEventListener("keydown", function (e) {
										if (e.key === "Enter") {
											const selection = window.getSelection();
											const range = selection.getRangeAt(0);
											console.log(range.startOffset); // Logs caret position within the text
										}
									});

									markdownTextArea.current.appendChild(block);
								}}
							>
								H1
							</button>
							<button
								className="bg-slate-100 text-black py-2 px-3 rounded-full font-bold"
								onClick={() => {
									const block = document.createElement("h2");

									block.classList.add("note-heading2");
									block.setAttribute("contenteditable", "true");

									block.setAttribute("data-placeholder", "Heading 2");
									block.textContent = "Heading 2";

									block.addEventListener("input", function () {
										if (block.textContent.trim() !== "") {
											block.classList.remove("empty");
										} else {
											block.classList.add("empty");
										}
									});

									markdownTextArea.current.appendChild(block);
								}}
							>
								H2
							</button>
							<button
								className="bg-slate-100 text-black py-2 px-3 rounded-full font-bold"
								onClick={() => {
									const block = document.createElement("li");

									block.classList.add("note-list");
									block.setAttribute("contenteditable", "true");

									block.setAttribute("data-placeholder", "Item 1");
									block.textContent = "Item 1";

									block.addEventListener("input", function () {
										if (block.textContent.trim() !== "") {
											block.classList.remove("empty");
										} else {
											block.classList.add("empty");
										}
									});

									markdownTextArea.current.appendChild(block);
								}}
							>
								List
							</button>
						</div>
					</>
				) : (
					<MarkdownPreview
						md={md}
						setPreview={setPreview}
						noteTitle={noteTitle}
					/>
				)}
			</div>
		</>
	);
};

export default NotesPage;
