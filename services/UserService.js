import UserRepository from "@repositories/UserRepository";
import { HttpBadRequest, HttpInternalServerError } from "@utils/HttpError";

import bcrypt from "bcrypt";

import { encrypt } from "@utils/Session";

export default class UserService {
	/**
	 * @type {UserRepository}
	 */
	#repository;

	constructor(repository) {
		this.#repository = repository;
	}

	async CreateUser({ name, username, password }) {
		try {
			const user = await this.#repository.IsUsernameExists(username);

			if (user.length)
				throw new HttpBadRequest("REGISTRATION_FAILED", {
					message: "Username already exists",
				});

			const hashedPassword = await bcrypt.hash(password, 10);

			await this.#repository.CreateUser({
				name,
				username,
				password: hashedPassword,
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async SignIn({ username, password }) {
		try {
			const jwt = await encrypt({ username });

			return jwt;
		} catch (err) {
			throw err;
		}
	}
}
