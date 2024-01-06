require('dotenv').config()

async function generateProfilePicture(gender) {

    let query

    if (gender === "man") {
        query = "man"
    } else if (gender === "woman") {
        query = "woman"
    } else {
        return
    }

    const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_API_KEY}`
    try {
        const response = await fetch(url)

        if (response.ok) {
            console.log("UNSPLASH successfully generated the resource.")
            console.log("-----------------------------------------------")
            const data = await response.json()
            return data.urls.small
        } else {
            console.error("Error while recovering profile photo: HTTP status:", response.status)
            console.log("-----------------------------------------------")
            return null
        }
    } catch (error) {
        console.error("Failed to generate the resource using Unsplash API. / error:", error)
        return null;
    }
}

module.exports = {
    generateProfilePicture
}