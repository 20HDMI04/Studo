const dotenv = require('dotenv').config();
const fastify = require('fastify')({
  logger: true
})
const db = require('./dbconnector');
db(fastify);

fastify.register(require('./routes'));


fastify.listen({ port: process.env.PORT || 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})