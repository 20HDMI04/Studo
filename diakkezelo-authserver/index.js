const dotenv = require("dotenv").config();
const fastify = require("fastify")({
	logger: true,
});
const fastifyCors = require("@fastify/cors");

const db = require("./dbconnector");
db(fastify);

async function init() {
	await fastify.register(fastifyCors, {
		credentials: true,
		origin: ["http://localhost:8080", "http://localhost:5173"],
	});
  
	await fastify.register(require("@fastify/jwt"), {
		secret: async function (request) {
			try{
				if (request.payload.refresh) {
					return `${process.env.JWTSECRETRFRESH}`;
				}else{
					return `${process.env.JWTSECRET}`;
				}
			}catch(e){
				try {
					if (request.headers.authorization.split(" ")[0] === "Refresh") {
						return `${process.env.JWTSECRETRFRESH}`;
					} else if (request.headers.authorization.split(" ")[0] === "Auth") {
						return `${process.env.JWTSECRET}`;
					} else {
						console.log("Error: No token found");
						return error;
					}
				} catch (error) {
					console.log("Error: No token found2");
					return error;
				}
			}
			
		},
		verify: { extractToken: (request) => {
			if (!request.headers.authorization) {
			  return null
			}
			if (request.headers.authorization.startsWith("Auth ")) {
				return request.headers.authorization.split(" ")[1];
			} else if (request.headers.authorization.startsWith("Refresh ")) {
				return request.headers.authorization.split(" ")[1];
			} else {
				return null;
			}
		  } },
	});
	await fastify.register(require("./routes"));

	fastify.listen(
		{ port: process.env.PORT || 3097/*, host: "10.5.0.7"*/ },
		(err, address) => {
			if (err) {
				fastify.log.error(err);
				process.exit(1); 
			}
		}
	);
}

init();
