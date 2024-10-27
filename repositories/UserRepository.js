import mysql from "@database/mysql";

export default class UserRepository {
	IsUsernameExists(username) {
		const QUERY = `
		SELECT
			id,
			name,
			username,
			password
		FROM
			users
		WHERE
			username = ?
	`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [username], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	CreateUser({ name, username, password }) {
		const QUERY = `

        INSERT INTO users 
            (name, username, password)
        VALUES
            (?,?,?)
    `;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [name, username, password], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	GetUserDetailsByID(id) {
		const QUERY = `
			SELECT
				id,
				name,
				username,
				password,
				profile_photo_url
			FROM
				users
			WHERE
				id = ?
		`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	UpdateUserDetailsByID(payload) {
		const { name, username, password, current_password, id } = payload;

		const QUERY = `CALL SP_UPDATE_USER_DETAILS(?,?,?,?)`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [name, username, password, id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	DeleteUserAccountByID(id) {
		const QUERY = `
			DELETE FROM
				users
			WHERE
				id = ?
		`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	UpdateProfilePhotoByUserID(id, profile_photo_url, public_id) {
		const QUERY = `
			UPDATE 
				users
			SET
				profile_photo_url = ?,
				public_id = ?
			WHERE
				id = ?
		`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [profile_photo_url, public_id, id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	GetProfilePhotoPublicIDByUserID(id) {
		const QUERY = `
			SELECT
				public_id
			FROM
				users
			WHERE
				id = ?
		`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}
}
