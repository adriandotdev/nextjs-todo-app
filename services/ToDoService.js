import ToDoRepository from "@repositories/ToDoRepository";

export default class ToDoService {
	/**
	 * @type {ToDoRepository}
	 */
	#repository;

	/**
	 *
	 * @param {ToDoRepository} repository
	 */
	constructor(repository) {
		this.#repository = repository;
	}
}
