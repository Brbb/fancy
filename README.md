# Fancy App

A simple MERN implementation of a login flow.

## Installation and Requirements

A `.env` file is required in the [`/backend`](https://github.com/Brbb/fancy/tree/master/backend) folder
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
will execute the command specified in the start script in [`package.json`](https://github.com/Brbb/fancy/tree/master/package.json)

```
concurrently \"cd backend && npm start\" \"cd frontend && npm start\"
```


### Run backend only:

From the [`/backend`](https://github.com/Brbb/fancy/tree/master/backend) folder with an instance or nodemon:

```
npm start
```

### Run frontend only:

From the [`/frontend`](https://github.com/Brbb/fancy/tree/master/frontend) folder:

```
npm start
```

## Test

### What is tested?

The __single units__ using unit tests. These units have been isolated using mocks to exclude database calls and split the behavior in the smallest micro-behaviors possible.

After the test it's possible to check the coverage in `/backend/coverage/lcov-report/index.html`

**Note**: some little parts have been ignored because the test is either insignificant or trivial (eg. `server.js` requires `app.js` and `mongoose`, but I trust the require module to do its job).
________

Some "big bang style" integration tests for the main functionalities without trying all the possible combinations of the composing segments.
This because the amount of time required is well beyond my availability. 

### Execute the test

ESLint is configured to check syntax in a pretest. In order to have the code fixed, run from the [`/backend`](https://github.com/Brbb/fancy/tree/master/backend) folder:

```
npm run pretest -- --fix
```
and if everything goes well:

```
npm test
```

This will run the unit tests (file `.test.js` near each file) and the integration tests in the `__test__` folder.

## Project structure
Backend and frontend have been separated in subfolders to allow a future possible division in multiple repositories. 


### Backend

Express API server with MongoDB as storage. 
___

The flow of an API call is:
```
API → Router → Handler → Controller → Model
```
The handler collects the request and prepares the parameters for the controller in order to make this concerned only about logic and Model. This also helps with testability and modularity.

It could be possible to move the code in the route files, but this becomes slightly unreadable and requires exports of all the methods used to allow testing. Each request is wrapped in a handle to catch `UnhandledRejection` and prevent Express to crash.

Form the `/routes/auth.js` file:
```javascript
const handler = require("./handlers/auth.handler");
const express = require("express");
const router = express.Router();
const handle = require("../helpers/promiseHelper").handle;
router.post("/login", handle(handler.login));
```
then in the `/routes/handlers/auth.handler.js`:
```javascript
module.exports{
    login: async (req, res) => {
		if (!req.body) return res.status(400).send({ err: "Request needs body" });

		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).send({ err: "Body needs email and password properties" });

		let result = await ctrl.login(email, password);
		if (result.err) return res.status(400).send(result);
		return res.send(result);
    }
}
```
and the `/controllers/auth.js`:
```javascript
login: async (email, password) => {
		var user = await auth.verifyUserPassword(email, password);
		if (user) {
			let token = auth.getToken(user.email);
			return { token: token, userId: user._id };
		}
		return { err: "Wrong username/password combination" };
	},
```


### Frontend

