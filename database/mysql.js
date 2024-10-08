import mysql from "mysql2";

let pool = mysql.createPool({
	connectionLimit: process.env.DB_CONNECTION_LIMIT,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true,
	port: process.env.DB_PORT,
	connectTimeout: 20000,
});

pool.getConnection(function (err, connection) {
	//declaration of db pooling
	if (err) {
		return console.error("error: " + err.message);
	}

	if (connection) {
		console.log("Successfully Connected to Database");
		connection.release(); //reuse of connection every after access
	}
});

pool.on("release", function (connection) {
	console.log(`Connection release: ${connection.threadId}`);
});

export default pool;
