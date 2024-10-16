const dotenv = require("dotenv").config();

async function searchForUser(fastify, user, password) {
  try {
      const mariadb = await fastify.mariadb;
      const connection = await mariadb.getConnection();
      const result = await mariadb.query('SELECT Username, Password FROM mydb.Teachers WHERE Username = ?', [user]);
      connection.release();
      let final = await JSON.parse(JSON.stringify(result));
      if (final[0].Password === password) {
        return true;
      } else {
        return false;
      }
  } catch (error) {
      return false;
  }
}

async function routes (fastify, options) {
    fastify.get("/", async (request, reply) => {
        return { hello: "world" };
    });

    fastify.post("/login", async (request, reply) => {
        console.log(`Someone try to login: ${request.body}`);
        const { user, password } = request.body;
        if (await searchForUser(fastify, user, password)) {
            const token = fastify.jwt.sign({ user: user });
            const finalToken = `Auth ${token}`;
            return { finalToken };
        } else {
          return { error: "Unauthorized" };
        }
    });

    
}


module.exports = routes;