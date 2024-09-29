import mysql from "@database/mysql";

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

export { GetUsers };
