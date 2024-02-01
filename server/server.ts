/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */

app.post('/snake/score', async (req, res, next) => {
  console.log(req.body);
  try {
    const body = req.body;
    if (!body) return;
    const { userId, userName, score } = body;

    if (!score) {
      throw new ClientError(400, 'missing score');
    }
    if (!userId) {
      throw new ClientError(400, 'missing userId');
    }
    if (!userName) {
      throw new ClientError(400, 'missing userName');
    }
    console.log(body);
    const sql = `
      insert into "leaderBoard" ("userId", "userName", "score")
        values ($1, $2, $3)
        returning *;
    `;
    const result = await db.query(sql, [userId, userName, score]);
    const entry = result.rows[0];
    console.log(entry);
    if (!entry) {
      throw new ClientError(500, 'Failed to insert into database');
    }

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
