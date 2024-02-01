set client_min_messages to warning;
-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;
create schema "public";
CREATE TABLE "public"."users" (
  "userId" serial PRIMARY KEY,
  "userName" varchar,
  "passwordHash" varchar
);
CREATE TABLE "public"."leaderBoard" (
  "leaderBoardId" serial PRIMARY KEY,
  "userId" integer,
  "userName" varchar,
  "score" integer
);
ALTER TABLE "public"."leaderBoard" ADD FOREIGN KEY ("userId") REFERENCES "public"."users" ("userId");
ALTER TABLE "public"."leaderBoard" ADD FOREIGN KEY ("userName") REFERENCES "public"."users" ("userName");
