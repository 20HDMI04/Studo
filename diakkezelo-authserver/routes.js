async function searchForUser(fastify, user, password, mode) {
  try {
      const mariadb = await fastify.mariadb;
      const connection = await mariadb.getConnection();
      const table = mode === "student" ? "TestStudent" : "TestTeacher";
      let result;
      if(table === "TestTeacher") {
        result = await mariadb.query(`SELECT TeacherId, Password FROM mydb.${table} WHERE TeacherId = ?`, [user]);
      } else {
        result = await mariadb.query(`SELECT OmNumber, Password FROM mydb.${table} WHERE OmNumber = ?`, [user]);
      }
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
        if (request.body === undefined) reply.code(400).send({ error: "Bad Request" });
        const data = await request.body;
        const acc = data.user;
        const password = data.password;
        const mode = data.mode;
        if (await searchForUser(fastify, acc, password, mode)) {
            const token = await request.server.jwt.sign({user: acc, refresh:false},{expiresIn: '10m' });
            const finalToken = `Auth ${token}`;
            const refreshToken = await request.server.jwt.sign({user: acc, refresh:true},{expiresIn: '1d' });
            const finalRefreshToken = `Refresh ${refreshToken}`;
            const maindata = {"token": finalToken,"refresh": finalRefreshToken, "mode": mode};
            return reply.send(maindata);
        } else {
          return { error: "Unauthorized" };
        }
    });

    fastify.post("/refresh", async (request, reply) => {
        const refreshToken = await request.body.refreshToken;
        if (refreshToken === undefined) reply.code(400).send({ error: "Bad Request" });
        if (!refreshToken.startsWith("Refresh ")) return { error: "Unauthorized" };
        try {
            await request.jwtVerify();
            const decoded = await request.server.jwt.verify(refreshToken.split(" ")[1]);
            const token = await request.server.jwt.sign({user: decoded.user, refresh:false} ,{expiresIn: '10m' });
            const finalToken = `Auth ${token}`;
            const maindata = {"token": finalToken};
            return reply.send(maindata);
        } catch (error) {
          console.log(error);
          return { error: "Unauthorized" };
        }
    });
}


module.exports = routes;