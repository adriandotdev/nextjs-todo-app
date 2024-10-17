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
									className="max-w-[30rem] w-full overflow-hidden h-auto outline-none resize-none text-3xl font-bold min-h-[2.5rem] text-slate-900"
									onChange={handleOnChangeOnNoteTitle}
									value={noteTitle}
									maxLength={50}
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
							className="max-w-[30rem] w-full overflow-x-hidden h-auto min-h-[80vh] outline-none resize-none leading-8 pt-1"
							placeholder="Create your notes"
							onChange={handleOnChangeOnMarkdownTextArea}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault(); // Prevent the default action of the "Enter" key

									// Get the current selection/caret position
									const selection = window.getSelection();
									const range = selection.getRangeAt(0);
									let currentNode = range.startContainer;

									// Create a new <p> element
									const newParagraph = document.createElement("p");
									newParagraph.setAttribute("data-placeholder", "Type here...");
									// newParagraph.textContent = "New paragraph here...";

									// Check if currentNode is a text node, if so, get the parent element
									if (currentNode.nodeType === Node.TEXT_NODE) {
										currentNode = currentNode.parentNode;
									}
									console.log("TYPE OF CURRENT NODE: " + currentNode);
									// Insert the <p> element after the current heading
									const parentNode = currentNode.closest("h1, h2, p"); // Assuming cursor is in <h1> or <h2>
									if (parentNode) {
										parentNode.insertAdjacentElement("afterend", newParagraph);

										// Move the cursor to the newly created paragraph
										const newRange = document.createRange();
										newRange.setStart(newParagraph, 0);
										newRange.collapse(true);
										selection.removeAllRanges();
										selection.addRange(newRange);
									}
								}
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
