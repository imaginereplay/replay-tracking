const helmet = require('@fastify/helmet');
const compress = require('@fastify/compress');
const cors = require('@fastify/cors');
const fastifyCookie = require('@fastify/cookie');
const fastifyFormbody = require('@fastify/formbody');
const fastifyRateLimit = require('@fastify/rate-limit');
const hpp = require('hpp');
const sanitizeHtml = require('sanitize-html');

const serverConfig = (fastify) => {
  // CORS for cross-origin requests
  fastify.register(cors);

  // Rate limit plugin
  fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  // Cookie parser
  fastify.register(fastifyCookie);

  // Form body parser
  fastify.register(fastifyFormbody);

  // Helmet for security headers
  fastify.register(helmet);

  // Compression for response
  fastify.register(compress, { global: true });

  fastify.addHook('preHandler', (request, reply, done) => {
    hpp();
    done();
  });

  fastify.addHook('preHandler', (request, reply, done) => {
    if (request.body) {
      request.body = sanitizeRequest(request.body);
    }
    if (request.query) {
      request.query = sanitizeRequest(request.query);
    }
    if (request.params) {
      request.params = sanitizeRequest(request.params);
    }
    done();
  });

  fastify.addHook('onRequest', async (request, reply) => {
    const xApiKey = request.headers['xapi-key'];
    if (process.env.NODE_ENV !== "development" && (!xApiKey || xApiKey !== process.env.X_API_KEY)) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

const sanitizeRequest = (data) => {
  if (typeof data === 'string') {
    return sanitizeHtml(data);
  } else if (typeof data === 'object') {
    for (const key in data) {
      data[key] = sanitizeRequest(data[key]);
    }
  }
  return data;
};

module.exports = serverConfig;
