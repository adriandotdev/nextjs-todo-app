import UserRepository from "@repositories/UserRepository";
import { HttpBadRequest, HttpInternalServerError } from "@utils/HttpError";

import bcrypt from "bcrypt";

import { generateAccessToken, generateRefreshToken } from "@utils/Session";

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
			const user = await this.#repository.IsUsernameExists(username);

			if (!user.length)
				throw new HttpBadRequest("INVALID_CREDENTIALS", {
					message: "Invalid credentials",
				});

			const hashedPassword = user[0].password;

			const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

			if (!isPasswordCorrect)
				throw new HttpBadRequest("INVALID_CREDENTIALS", {
					message: "Invalid credentials",
				});

			const data = {
				username,
				id: user[0].id,
			};

			const accessToken = await generateAccessToken({ data });
			const refreshToken = await generateRefreshToken({ data });

			return { access_token: accessToken, refresh_token: refreshToken };
		} catch (err) {
			throw err;
		}
	}
}
