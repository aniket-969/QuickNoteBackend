# QuickNotes Backend

## 🚀 Project Description
The backend service for QuickNotes provides a RESTful API for user authentication and note management. Built with Node.js, Express, and MongoDB, it supports secure user registration/login, JWT-based sessions, and full CRUD operations on notes.

## 🧰 Tech Stack
- **Node.js** – JavaScript runtime  
- **Express** – Web framework  
- **MongoDB** – NoSQL document database  
- **Mongoose** – ODM for MongoDB  
- **JSON Web Tokens (JWT)** – Authentication  
- **Zod** – Schema validation  
- **dotenv** – Environment variable management  
- **cors** – Cross-origin resource sharing  
- **nodemon** – Dev-time auto-reloading  

## 📋 Prerequisites
- **Node.js** v14+  
- **npm** v6+ or **Yarn** v1.22+  
- **MongoDB** running locally or a MongoDB Atlas URI

## ⚙️ Setup & Run Locally

```bash
## Clone the repo and navigate into the root folder
git clone https://github.com/aniket-969/QuickNoteBackend.git
```

## Install dependencies
npm install
## or
yarn install

## Create environment file
.env

MONGODB_URI =

PORT = 3000

CORS_ORIGIN = 'http://localhost:5173'

ACCESS_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRY=100d


## Start the development server
npm start

## 📡 API Documentation (Backend)

- **POST** `/auth/register`  
  Register a new user

- **POST** `/auth/login`  
  Log in and receive an access token

- **GET** `/auth/session`  
  Get current user session

- **POST** `/auth/logout`  
  Log out the current user

- **GET** `/notes`  
  Retrieve all notes for the authenticated user

- **GET** `/notes/:id`  
  Retrieve a single note by its ID

- **POST** `/notes`  
  Create a new note

- **PATCH** `/notes/:id`  
  Update an existing note

- **DELETE** `/notes/:id`  
  Delete a note by its ID
