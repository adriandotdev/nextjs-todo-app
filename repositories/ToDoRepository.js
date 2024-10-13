import mysql from "@database/mysql";

export default class ToDoRepository {
	CreateToDo(data) {
		const { title, priority, user_id } = data;

		const QUERY = `

            INSERT INTO
                todos (title, priority, user_id)
            VALUES
                (?,?,?)
        `;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [title, priority, user_id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	GetTodosByUserId(data) {
		const { id } = data;

		const QUERY = `
            SELECT
                id,
                title,
                priority,
                date_created,
                date_modified
            FROM
                todos
            WHERE
                user_id = ?
        `;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	DeleteTodoByID(id) {
		const QUERY = `
			DELETE FROM
				todos
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
