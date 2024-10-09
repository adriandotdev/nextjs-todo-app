import mysql from "@database/mysql";

export default class UserRepository {
	IsUsernameExists(username) {
		const QUERY = `
		SELECT
			id,
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
}
