import mysql from "@database/mysql";
import bcrypt from "bcrypt";

const GetUsers = () => {
	const QUERY = `
        SELECT 
            id,
            name,
            username,
            password
        FROM
            users;
    `;
	return new Promise((resolve, reject) => {
		mysql.query(QUERY, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

const CreateUser = async ({ name, username, password }) => {
	const hashedPassword = await bcrypt.hash(password, 10);

	const QUERY = `

        INSERT INTO users 
            (name, username, password)
        VALUES
            (?,?,?)
    `;

	return new Promise((resolve, reject) => {
		mysql.query(QUERY, [name, username, hashedPassword], (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

export { GetUsers, CreateUser };
