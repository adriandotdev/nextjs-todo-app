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

	async CreateToDo(data) {
		try {
			await this.#repository.CreateToDo(data);
		} catch (err) {
			throw err;
		}
	}

	async GetTodosByUserId(data) {
		try {
			const todos = await this.#repository.GetTodosByUserId(data);
			return todos;
		} catch (err) {
			throw err;
		}
	}

	async DeleteTodoByID(id) {
		try {
			await this.#repository.DeleteTodoByID(id);
		} catch (err) {
			throw err;
		}
	}

	async UpdateTodoByID(id, payload) {
		try {
			await this.#repository.UpdateTodoByID(id, payload);
		} catch (err) {
			throw err;
		}
	}

	async UpdateTodoStatusByID(id, status) {
		try {
			await this.#repository.UpdateTodoStatusByID(id, status);
		} catch (err) {
			throw err;
		}
	}
}
