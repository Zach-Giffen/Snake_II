/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import {
  ClientError,
  authMiddleware,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  userName: string;
  passwordHash: string;
};

type Auth = {
  username: string;
  password: string;
};

type Entry = {
  entryId: number;
  userName: string;
  score: number;
};

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

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

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    try {
      const hashedPassword = await argon2.hash(password);
      const sql = `
      insert into "users" ("userName", "passwordHash")
      values ($1, $2)
      returning *
      `;
      const params = [username, hashedPassword];
      const result = await db.query<User>(sql, params);
      const [user] = result.rows;
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "passwordHash"
      from "users"
     where "userName" = $1
  `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, passwordHash } = user;
    if (!argon2.verify(passwordHash, password)) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.post('/snake/score', authMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body) return;
    const { score } = body;
    const { userId, userName } = body;

    if (!score) {
      throw new ClientError(400, 'missing score');
    }
    if (!userId) {
      throw new ClientError(400, 'missing userId');
    }
    if (!userName) {
      throw new ClientError(400, 'missing userName');
    }
    const sql = `
      insert into "leaderBoard" ("userId", "userName", "score")
        values ($1, $2, $3)
        returning *;
    `;
    const result = await db.query(sql, [userId, userName, score]);
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(500, 'Failed to insert into database');
    }
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

app.get('/api/snake/score', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      select "userId", "userName", "score" from "leaderBoard"
        order by "score" desc;
    `;
    const result = await db.query<User>(sql);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/snake/score/:userId', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const sql = `
      SELECT "score" FROM "leaderBoard"
      WHERE "userId" = $1;
    `;
    const result = await db.query<{ score: number }>(sql, [userId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found in leaderboard' });
    } else {
      res.status(200).json({ score: result.rows[0].score });
    }
  } catch (err) {
    next(err);
  }
});

app.put('/snake/score/entryId', authMiddleware, async (req, res, next) => {
  try {
    const { userName, score } = req.body as Partial<Entry>;
    if (!userName || !score) {
      throw new ClientError(400, 'userName, and score are required fields');
    }
    const sql = `
      update "leaderBoard"
        set "score" = $1
        where "userName" = $2
        returning *;
    `;
    const params = [score, userName];
    const result = await db.query<Entry>(sql, params);
    const [entry] = result.rows;
    if (!entry) {
      throw new ClientError(404, `User with username ${userName} not found`);
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
