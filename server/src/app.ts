import express from 'express';
import httpProxy from 'http-proxy';
import path from 'path';

import { logger } from './logger';
import { apollo } from './apollo';

const proxy = httpProxy.createProxyServer({});

export const app = express();

apollo.applyMiddleware({ app, path: '/graphql' });

app.use('/', function app(req, res) {
  proxy.web(
    req,
    res,
    { target: 'http://localhost:3000' },
    function proxyWebErrorHandler(err) {
      logger.error(err.message);
      res.sendFile(path.resolve('./public/index.html'));
    },
  );
});
