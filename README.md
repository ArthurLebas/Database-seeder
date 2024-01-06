# Database Seeder

This project consists of scripts designed to generate and import fake data into a PostgreSQL database, specifically targeting the 'user' table. It utilizes the OpenAI and Unsplash APIs to create realistic but fictional data entries for users. To run the project, it's necessary to have accounts on both these platforms and obtain your personal API keys. This setup is ideal for testing, development, or demonstration purposes where populated user data is required

## Configuration

Before running the script, please follow these steps:

1. **Create a PostgreSQL database.**
2. **Create a `.env` file at the root of the project.** This file should be based on the provided `.env.example` file. Copy the contents of `.env.example` into your new `.env` file and update the values to match your environment and credentials.
3. **Ensure that all environment variables in the `.env` file are correctly configured.** These variables include your database connection settings and API keys for OpenAI and Unsplash.

By setting up these configurations, you ensure that the script can connect to your database and access the necessary APIs to generate and import data.

## Installation

1. Make sure you have Node.js and PostgreSQL installed on your machine.
2. Clone this GitHub repository onto your machine.
3. Install the dependencies by running the following command:

    > `npm install`

## Third-Party APIs

This script uses the following third-party APIs. **It is crucial to be aware of their respective rate limits**:

- **Unsplash API** for images: [Visit Unsplash Developers](https://unsplash.com/developers)
- **OpenAI API** for data generation: [Visit OpenAI Platform](https://platform.openai.com/)

## Database Setup and Data Seeding

1. **Create the 'user' Table**:  
   To initialize your database and create the 'user' table, run the following command:

```shell
node initDB.js
```

2. **Import Fake Data**:  
After setting up the 'user' table, you can import the fake data into your database with this command:

```shell
node seeding.js
```


## Licence

This project is licensed under the MIT License. Please refer to the LICENSE file for more information.

## Contribution

Contributions are welcome! If you wish to contribute to this project, please open a pull request, I would be happy to review it
