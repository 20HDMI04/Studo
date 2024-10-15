function conncectdb(fastify) {
    fastify.register(require('fastify-mariadb'), {
      promise: true,
      connectionString: `${process.env.MARIADBCONNECTIONSTRING}`
    });
} 

module.exports = conncectdb;