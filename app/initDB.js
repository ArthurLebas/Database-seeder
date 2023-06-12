require('dotenv').config();
const { Client } = require('pg')

const databaseHost = process.env.DATABASE_HOST
const databasePort = process.env.DATABASE_PORT
const databaseName = process.env.DATABASE_NAME
const databaseUser = process.env.DATABASE_USER
const databasePassword = process.env.DATABASE_PASSWORD

const databaseURL = `postgresql://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}`

const sqlScript = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_format') THEN
    CREATE DOMAIN "email_format" AS text CHECK (
      value ~ '^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "user" (
  "id" SERIAL PRIMARY KEY,
  "email" "email_format" NOT NULL UNIQUE,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "description" TEXT,
  "date_of_birth" TIMESTAMPTZ,
  "password" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "city" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "photo" (
  "id" SERIAL PRIMARY KEY,
  "path" TEXT NOT NULL,
  "user_id" INT REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);
`


const initDB = (async () => {
    const client = new Client({
        connectionString: databaseURL,
        ssl: false
    })
    
    try {
        await client.connect()
    } catch (err) {
        console.error('Failed to connect to the database:', err)
        return
    }
    
    try {
        await client.query(sqlScript)
    } catch (err) {
        console.error('Failed to execute the SQL script:', err)
        return
    } finally {
        client.end()
    }
})

initDB()
