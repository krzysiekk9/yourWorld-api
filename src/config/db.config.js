import knex from "knex";

//DB config
export const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "yourworld",
  },
});
