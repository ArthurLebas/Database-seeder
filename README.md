# Database Seeder

This project is a script designed to generate and import fake data into a PostgreSQL database.
It uses the OpenAI and Unsplash APIs, so it is necessary to create an account on these two platforms and get your own API keys.

## Configuration

Before running the script, create a PostgreSQL database and ensure that you configure the environment variables correctly in the `.env` file based on the `.env.example` file.

## Installation

1. Make sure you have Node.js and PostgreSQL installed on your machine.
2. Clone this GitHub repository onto your machine.
3. Install the dependencies by running the following command:

    > `npm install`

## Usage

Ensure you have an active Internet connection, as the script interacts with third-party APIs to generate data.

### Third-Party APIs (Important: CHECK THE RATE LIMITS)

    > Unsplash ---> https://unsplash.com/developers
    > OpenAI   ---> https://platform.openai.com/

To create the table "user" in your database use the following command:

   > `node initDB.js`

To import the fake data into your database, use the following command:

   > `node seeding.js`

## Licence

This project is licensed under the MIT License. Please refer to the LICENSE file for more information.

## Contribution

Contributions are welcome! If you wish to contribute to this project, please open a pull request, I would be happy to review it
