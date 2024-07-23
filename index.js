require("dotenv").config();
const Fastify = require("fastify");
const contractRoutes = require("./server/routes/contract");
const serverConfig = require("./server/config");

const fastify = Fastify();

serverConfig(fastify);

fastify.register(contractRoutes);

const start = async () => {
  try {
    fastify.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
  }
};

start();
