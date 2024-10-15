async function routes (fastify, options) {
    
    fastify.get('/', async (request, reply) => {
      return { hello: 'world' }
    });

    fastify.get('/user', async (req, reply) => {
      const mariadb = await fastify.mariadb;
      const connection = await mariadb.getConnection();
      const result = await mariadb.query('SELECT * FROM Persons')
      connection.release() 
      console.log(result)
      return result;
    });

    fastify.post('/user/add', async (req, reply) => {
      console.log(req.body)
      const mariadb = await fastify.mariadb;
      const connection = await mariadb.getConnection();
      const result = await mariadb.query('INSERT INTO Persons (PersonID, LastName, FirstName, Address, City) VALUES (?, ?, ?, ?, ?)', [req.body.PersonID,req.body.LastName, req.body.FirstName, req.body.Address, req.body.City])
      connection.release();
      return result;
    });

    fastify.post('/user/delete', async (req, reply) => {
      console.log(req.body)
      const mariadb = await fastify.mariadb;
      const connection = await mariadb.getConnection();
      const result = await mariadb.query('DELETE FROM Persons WHERE PersonID = ?', [req.body.PersonID])
      connection.release();
      return result;
    });

    fastify.get("/protected", async (request, reply) => {
      try {
          await request.headers["authorization"];
          let token = request.headers["authorization"].split(" ");
          if (token[0] !== "Auth") {
              reply.code(401).send({ error: "Unauthorized" });
              throw new Error("Invalid token");
          }
          await fastify.jwt.verify(token[1],process.env.JWTSECRET, (err, decoded) => {
              if (err) {
                  reply.code(401).send({ error: "Unauthorized" });
                  throw new Error("Invalid token");
              }
          });
          return { message: "You are authorized" };
      } catch (err) {
          console-log(request);
          reply.code(401).send({ error: "Unauthorized" });
      }
    });

}

module.exports = routes;