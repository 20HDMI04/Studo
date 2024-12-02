async function routes(fastify, options) {
	fastify.get("/", async (request, reply) => {
		return { hello: "world" };
	});

	fastify.get("/user", async (req, reply, done) => {
		const mariadb = await fastify.mariadb;
		const connection = await mariadb.getConnection();
		const result = await mariadb.query("SELECT * FROM Persons");
		connection.release();
		console.log(result);
		return result;
	});

	fastify.post("/user/add", async (req, reply) => {
		console.log(req.body);
		const mariadb = await fastify.mariadb;
		const connection = await mariadb.getConnection();
		const result = await mariadb.query(
			"INSERT INTO Persons (PersonID, LastName, FirstName, Address, City) VALUES (?, ?, ?, ?, ?)",
			[
				req.body.PersonID,
				req.body.LastName,
				req.body.FirstName,
				req.body.Address,
				req.body.City,
			]
		);
		connection.release();
		return result;
	});

	fastify.post("/user/delete", async (req, reply) => {
		console.log(req.body);
		const mariadb = await fastify.mariadb;
		const connection = await mariadb.getConnection();
		const result = await mariadb.query(
			"DELETE FROM Persons WHERE PersonID = ?",
			[req.body.PersonID]
		);
		connection.release();
		return result;
	});

	fastify.get("/protected", async (request, reply) => {
		if (!(await authCheck(request, fastify))) {
			return reply.code(401).send({ error: "Unauthorized" });
		}
	});

	fastify.get("/mainpage-resource", async (request, reply) => {
		if (!(await authCheck(request, fastify))) {
			return reply.code(401).send({ error: "Unauthorized" });
		}
		const decoded = await fastify.jwt.verify(await request.headers["authorization"].split(" ")[1]);
		let user = decoded.user;
		const mariadb = await fastify.mariadb;
		const connection = await mariadb.getConnection();
		const result = await mariadb.query("SELECT OmNumber, Student_Name FROM mydb.TestStudent WHERE OmNumber = ?",[user]);
		connection.release();
		return reply.send({ data: result[0] });
	});
}

async function authCheck(request, fastify) {
	try {
		await request.headers["Authorization"];
		await request.jwtVerify();
	} catch (err) {
		console.log(err);
		return false;
	}
	return true;
}
module.exports = routes;
