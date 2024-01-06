require('dotenv').config()

const createData = require('./createData')
const { Client } = require('pg');

const databaseHost = process.env.DATABASE_HOST
const databasePort = process.env.DATABASE_PORT
const databaseName = process.env.DATABASE_NAME
const databaseUser = process.env.DATABASE_USER
const databasePassword = process.env.DATABASE_PASSWORD

const databaseURL = `postgresql://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}`


const seedDB = (async () => {

    const users = await createData.createUsers()

    const client = new Client({
        connectionString: databaseURL,
        ssl: false,
    })

    await client.connect()

    console.log('Clean Table')

    await client.query('TRUNCATE TABLE "user" RESTART IDENTITY')

    const queries = []
    let count = 0

    users.forEach((user) => {
        count += 1
        console.log("insert user n°" + count)
        const query = client.query(
            `
            INSERT INTO "user"
            ("email","first_name", "last_name", "date_of_birth", "password", "country", "region", "city", "description", "photo")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
            `,
            [user.email, user.first_name, user.last_name, user.date_of_birth, user.password, user.country, user.region, user.city, user.description, user.photo],
        );
        queries.push(query)
    });

    await Promise.all(queries)

    console.log('All operations executed successfully. Disconnecting from the database.')

    client.end()

})

seedDB()