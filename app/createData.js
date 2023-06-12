require('dotenv').config();

const bcrypt = require('bcrypt')
const faker = require('@faker-js/faker').fakerFR;

const NB_USERS = 20

const users = []
const userPhotos = []
const regions = ['Île-de-France', 'Centre-Val de Loire', 'Bourgogne-Franche-Comté', 'Normandie', 'Hauts-de-France', 'Grand Est', 'Pays de la Loire', 'Bretagne', 'Nouvelle-Aquitaine', 'Occitanie', 'Auvergne-Rhône-Alpes', "Provence-Alpes-Côte d'Azur", 'Corse', 'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte']

// password function
function generateSecurePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?=.!@#+=$%^&*'
    const charsetLength = charset.length

    let password = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength)
        password += charset[randomIndex]
    }

    return password
}

// openai function
async function generateUserProp(params, request) {
    let prompt
    if (request === "description") {
        let pronoun = params.gender === "homme" ? 'un' : "une"
        prompt = `Ecris une description de 60 à 160 caractères à la première personne pour un utilisateur prénommé ${params.username} et qui est ${pronoun} ${params.gender}. Ne mentionne pas le prénom dans la description et ne commence pas la description par 'je suis ${pronoun} ${params.gender}'`
    }
    if (request === "city") {
        prompt = `trouve moi une ville présente dans la régions ${params.region}. envoie moi uniquement son nom sans point à la fin`
    }

    const response = await fetch(
        `https://api.openai.com/v1/completions`,
        {
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt,
                temperature: 0.8,
                max_tokens: 200,
            }),
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            }
        }
    )
    if (response.ok) {
        console.log("OpenAI API successfully generated the resource.")
        console.log("-----------------------------------------------")
        const res = await response.json()
        const userProp = res.choices[0].text.trim()
        return userProp
    } else {
        console.error("Failed to generate the resource using the OpenAI API. / HTTP status:", response.status)
        console.log("-----------------------------------------------")
        return null
    }
}

// unsplash function
async function generateProfilePicture(gender) {
    const query = gender === "homme" ? "man" : "woman"
    const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_API_KEY}`
    try {
        const response = await fetch(url)

        if (response.ok) {
            console.log("UNSPLASH successfully generated the resource.")
            console.log("-----------------------------------------------")
            const data = await response.json()
            return data.urls.small
        } else {
            console.error("Erreur lors de la récupération de la photo de profil: HTTP status:", response.status)
            console.log("-----------------------------------------------")
            return null
        }
    } catch (error) {
        console.error("Failed to generate the resource using Unsplash API. / HTTP status:", response.status)
        return null;
    }
}

// GENERATE USER FUNCTION
async function createUsers() {
    const usersPromises = [];
    for (let i = 0; i < NB_USERS; i++) {
        let gender = undefined
        const user = {}
        const randomNumber = Math.round(Math.random())
        if (randomNumber === 0) {
            gender = "homme"
            user.first_name = faker.person.firstName('male')
        } else {
            gender = "femme"
            user.first_name = faker.person.firstName('female')
        }
        user.last_name = faker.person.lastName()
        user.email = faker.internet.email({firstName: user.first_name, lastName: user.last_name})
        user.date_of_birth = faker.date.past({years: 65})

        const securePassword = generateSecurePassword(10)

        const hashedPassword = await bcrypt.hash(securePassword, 10)

        user.password = hashedPassword

        user.region = regions[Math.floor(Math.random() * regions.length)]
        user.gender = gender

        const [description, city] = await Promise.all([
            generateUserProp({ username: user.first_name, gender }, "description"),
            generateUserProp({ region: user.region }, "city")
        ]);

        user.description = description
        user.city = city

        users.push(user)
        usersPromises.push(Promise.resolve())
    }

    await Promise.all(usersPromises);
    console.log(users)
    return users
}
// GENERATE PHOTO FUNCTION
async function createUsersPhoto() {
    const photoPromises = []
    const usedUserIds = new Set()

    for (let i = 0; i < NB_USERS; i++) {
        const photo = {}

        let userPhotoRandomNumber = faker.number.int({ min: 1, max: NB_USERS })
        while (usedUserIds.has(userPhotoRandomNumber)) {
            userPhotoRandomNumber = faker.number.int({ min: 1, max: NB_USERS })
        }

        usedUserIds.add(userPhotoRandomNumber)
        let user = users[userPhotoRandomNumber - 1]
        const generatePhotoPromise = new Promise(async (resolve) => {
            if (user.gender === "homme") {
                const url = await generateProfilePicture("homme")
                photo.path = url
            }
            if (user.gender === "femme") {
                const url = await generateProfilePicture("femme")
                photo.path = url
            }
            photo.user_id = userPhotoRandomNumber
            userPhotos.push(photo)
            resolve()
        });
        photoPromises.push(generatePhotoPromise)
    }

    await Promise.all(photoPromises)
    console.log(userPhotos)
    return userPhotos
}

module.exports = {
    createUsers,
    createUsersPhoto,
};