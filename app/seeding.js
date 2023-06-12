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
    const usersPhotos = await createData.createUsersPhoto()

    const client = new Client({
        connectionString: databaseURL,
        ssl: false,
    })

    await client.connect()

    console.log('Clean Table')

    await client.query('TRUNCATE TABLE "user", "photo" RESTART IDENTITY');

    const queries = []
    let count = 0

    users.forEach((user) => {
        count += 1
        console.log("insert user n°" + count)
        const query = client.query(
            `
            INSERT INTO "user"
            ("email","first_name", "last_name","date_of_birth", "password","region", "city", "description")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [user.email, user.first_name, user.last_name, user.date_of_birth, user.password, user.region, user.city, user.description],
        );
        queries.push(query)
    });
    count = 0
    usersPhotos.forEach((photo) => {
        count += 1
        console.log("insert photo n°" + count)
        const query = client.query(
            `
            INSERT INTO "photo"
            ("path", "user_id")
            VALUES
            ($1, $2)
            RETURNING *
            `,
            [photo.path, photo.user_id],
        );
        queries.push(query)
    });
    count = 0

    await Promise.all(queries)

    console.log('Insertion Done')

    client.end()

})

seedDB()