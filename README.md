# Fancy App

A simple MERN implementation of a login flow.

## Installation and Configuration

A `.env` file is needed in the `/backend` folder
```
DB_URL=mongodb://<user>:<password>@<server>:<port>/fancydb
API_PORT=3001
TOKEN_SECRET=<anysecret>
TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyYW5jZXNjb0BlbWFpbC5jb20iLCJqdGkiOiI4YmU2ZjJhMzg2NDk2YWRkOTRhNTgyZjk0OWY4MjEzOCIsImlhdCI6MTU0NTM3ODI0NSwiZXhwIjoxNTQ1NDIxNDQ1fQ.oq18-oCfloQNzL-9acnRb_m1HB4W4pKu3nRGUCZEvI0
LISTENING_TO_UNHANDLED_REJECTION=false
```

Install backend modules:
```
cd backend && npm init
```

Install frontend modules:
```
cd frontend && npm init
```
## Run

To quickly setup and run the app with frontend and backend concurrenlty, from the project root directory execute:

```
npm start
```
will execute the command specified in the start script in `package.json`

```
concurrently \"cd backend && npm start\" \"cd frontend && npm start\"
```


### Run backend only:

From the `/backend` folder with an instance or nodemon:

```
npm start
```

### Run frontend only:

From the `/frontend` folder:

```
npm start
```

## Test

ESLint is configured to check syntax in a pretest. In order to have the code fixed, run from the `/backend` folder:

```
npm run pretest -- --fix
```
and if everything goes well:

```
npm test
```

This will run the unit tests (file `.test.js` near each file) and the integration tests in the `__test__` folder.

## Architecture

### Backend

### Frontend

