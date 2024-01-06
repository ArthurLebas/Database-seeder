require('dotenv').config()

async function generateUserProp(params, request) {
    let prompt
    switch (request) {
        case "description":
            prompt = `Write a first-person description of 60 to 160 characters for a user named ${params.username}, who is a ${params.gender}. Do not mention the username in the description, and do not start the description with 'I am a ${params.gender}.`
            break;
        case "regions":
            prompt = `Write a JSON object. Each property of this object should be a country (${params.countries.join()}), and each value should be an array containing the names of at most 15 regions in their respective language, if the language uses the same alphabet as English. If a country has fewer than 15 regions, include all the regions of that country. Otherwise, include only the first 15 regions. If the language of the country uses a different alphabet, write the names of the regions in English. Your response should contain only this object, without any other words, explanation, or assignment to a variable.`
            break;
        case "city":
            prompt = `Find me a city located in the ${params.region} region. Your response should contain only region, without any other words or explanation`
            break;
        default:
            return;
    }    

    const response = await fetch(
        `https://api.openai.com/v1/completions`,
        {
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt,
                temperature: 0.8,
                max_tokens: 500,
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
        let userProp = res.choices[0].text
        // userProp = userProp.replace(/\n/g, "").replace(/ /g, "");
        return userProp
    } else {
        console.error("Failed to generate the resource using the OpenAI API. / HTTP status:", response.status)
        console.log("-----------------------------------------------")
        return null
    }
}

module.exports = {
    generateUserProp
}