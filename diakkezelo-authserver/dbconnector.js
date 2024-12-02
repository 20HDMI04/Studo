function conncectdb(fastify) {
    fastify.register(require('fastify-mariadb'), {
      promise: true,
      connectionString: `${process.env.MARIADBCONNECTIONSTRINGTESTING}`
    });
} 

module.exports = conncectdb;