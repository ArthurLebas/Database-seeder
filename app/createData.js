require('dotenv').config()
const bcrypt = require('bcrypt')
const faker = require('@faker-js/faker').fakerFR
const openai = require('./openai')
const unsplash = require('./unsplash')
const password = require('./password')

const NB_USERS = process.env.NB_USERS
const USERS_COUNTRIES = JSON.parse(process.env.USERS_COUNTRIES)
const PWD_LENGTH = process.env.PWD_LENGTH

const users = []

// GENERATE USER FUNCTION
async function createUsers() {
    const usersPromises = []

    if (!Array.isArray(USERS_COUNTRIES)) {
        throw new Error("USERS_COUNTRIES should be an array.")
    }
    if (USERS_COUNTRIES.length > 4) {
        throw new Error("USERS_COUNTRIES should have a maximum of 4 entries.")
    }

    const regions = JSON.parse(await openai.generateUserProp({countries: USERS_COUNTRIES}, "regions"))
    
    for (let i = 0; i < NB_USERS; i++) {
        let gender = undefined
        const user = {}
        const randomNumber = Math.round(Math.random())
        if (randomNumber === 0) {
            gender = "man"
            user.photo = await unsplash.generateProfilePicture("man")
            user.first_name = faker.person.firstName('male')
        } else {
            gender = "woman"
            user.photo = await unsplash.generateProfilePicture("woman")
            user.first_name = faker.person.firstName('female')
        }
        user.last_name = faker.person.lastName()
        user.email = faker.internet.email({ firstName: user.first_name, lastName: user.last_name })
        user.date_of_birth = faker.date.past({ years: 65 })

        const securePassword = password.generateSecurePassword(PWD_LENGTH)
        const hashedPassword = await bcrypt.hash(securePassword, 10)

        user.password = hashedPassword
        user.country = USERS_COUNTRIES[Math.floor(Math.random() * USERS_COUNTRIES.length)]
        const countryRegions =  regions[user.country]
        user.region = countryRegions[Math.floor(Math.random() * countryRegions.length)]
        user.gender = gender

        const [description,city] = await Promise.all([
            openai.generateUserProp({ username: user.first_name, gender }, "description"),
            openai.generateUserProp({ region: user.region }, "city")
        ])

        user.description = description
        user.city = city

        users.push(user)
        usersPromises.push(Promise.resolve())
    }

    await Promise.all(usersPromises);
    console.log(users)
    return users
}

module.exports = {
    createUsers
}