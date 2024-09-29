# Task Management System - todoKeeper.in

todoKeeper.in is a task management system that allows users to create, read, update, and delete tasks (todos). It also features user authentication using social logins, and users have access to a personalized dashboard.

## Features

1. Create, Read, Update, and Delete (CRUD) Todos:

   - User can add new tasks, visit their existing tasks, edit task details and delete tasks.

2. User Authentication with Social Logins:

   - Secure user authentication with popular social media platforms (Google, Twitter, Facebook), ensuring a quick and easy login experience without the need of traditional usernames and passwords.

3. Separated User-friendly Dashboard

   - After login, users can access their personal dashboard to manage everything.

4. Achieving Milestone:

   - User will awarded by badges by completing certain limited tasks.

## Tech Stack

- **Node.js**: Backend runtime environment for javascript.
- **Express**: Server to handle routes.
- **EJS**: Templating engine.
- **jQuery**: Handle frontend interactions.
- **TailwindCSS**: CSS framework for styling.
- **Passport.js**: Javascript library for authentication.
- **Postgres**: Relational database to store user data and tasks.

## Installation

To run this project locally, follow these steps:

1. Clone this repository:
   ```bash
    git clone https://github.com/rajmanna-dev/tms.git
    cd tms
   ```
2. Install dependencies:
   ```bash
    npm i
   ```
3. Set up environmental variables:

   ```env
   PORT="3000"
   PG_USER=your-postgres-username
   PG_HOST=your-postgres-host-url
   PG_DB=your-database-name
   PG_PASS=your-database-password
   PG_PORT=your-database-running-port
   SESSION_KEY=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   TWITTER_CONSUMER_KEY=your-twitter-consumer-id
   TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret

   ```

4. Run server:
   ```bash
   npm start
   ```
5. Visit the application at `http://localhost:3000`.

## Usage

1. Social Login:

   - Sign in using your Google, Twitter, or Facebook account.

2. Task Management:

   - Once logged in, access your dashboard to create, view, update, or delete your tasks.

## Contributing

If you'd like to contribute to todoKeeper.in, please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE.txt)
