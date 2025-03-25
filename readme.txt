# Placify

# Tech Stack

- **Frontend:**
  - React (Version 18.3)
  - Redux Toolkit (for state management)
  - HTML/CSS
  - React Router (for client-side routing)
  
- **Backend:**
  - Node.js (Version 20.x)
  - Express.js (as the web application framework)
  - Axios (for making HTTP requests)
  - MongoDB (as the NoSQL database)
  
- **Authentication and Security:**
  - JSON Web Tokens (JWT) for authentication
  - bcrypt for password hashing
  
- **Other Tools and Libraries:**
  - Nodemailer (for sending emails)
  - Twilio (for sending whatsapp messages)
  - GEMINI API (for resume scoring)
  
- **Development Tools:**
  - Git (for version control)
  - GitHub (for hosting the repository)
  - Visual Studio Code (as the code editor)
  - Postman (for API testing)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`KEY`
`EMAIL_USER`
`EMAIL_PASSWORD`
`MONGO_URL`
`SERP_API_KEY` 
`GEMINI_KEY`
`TWILIO_AUTH_KEY`
`TWILIO_SID`

## Run Locally

Go to the project directory

```bash
  cd Placify
```

Install dependencies

```bash
  npm install
```

Start the react

```bash
  npm start
```

Start the server

```bash
  cd src
  cd server-side
  nodemon index.js
        (or)
  node index.js
```
