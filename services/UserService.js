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
				name: user[0].name,
			};

			const accessToken = await generateAccessToken({ data });
			const refreshToken = await generateRefreshToken({ data });

			return { access_token: accessToken, refresh_token: refreshToken };
		} catch (err) {
			throw err;
		}
	}

	async GetUserDetailsByID(id) {
		try {
			const user = await this.#repository.GetUserDetailsByID(id);

			if (!user.length)
				throw new HttpBadRequest("USER_NOT_FOUND", {
					message: `User with ID of ${id} is not found`,
				});

			return user[0];
		} catch (err) {
			throw err;
		}
	}

	async UpdateUserDetailsByID(payload) {
		try {
			console.log(payload);
			const user = await this.#repository.GetUserDetailsByID(payload.id);

			let hashedNewPassword = null;

			if (payload.current_password) {
				const isMatch = await bcrypt.compare(
					payload.current_password,
					user[0].password
				);

				if (!isMatch)
					throw new HttpBadRequest("INCORRECT_PASSWORD", {
						message: "Incorrect password",
					});
				hashedNewPassword = await bcrypt.hash(payload.password, 10);
			}

			const result = await this.#repository.UpdateUserDetailsByID({
				name: payload.name,
				username: payload.username,
				password: hashedNewPassword ? hashedNewPassword : payload.password,
				id: payload.id,
			});

			const STATUS = result[0][0].STATUS;
			const status_type = result[0][0].status_type;

			if (status_type === "bad_request") throw new HttpBadRequest(STATUS, null);

			if (status_type === "internal_server_error")
				throw new HttpInternalServerError(STATUS, null);

			return result[0][0];
		} catch (err) {
			throw err;
		}
	}
}
