# Bank API with CRUD functionallity

This project is about a CRUD API that deals with accounts data structure. It uses a .json file for storing data.

## What was used in this project:

 - Language: Javascript(ES6) 
 - Stack: Nodejs + Express
 - Documentation: Swagger
 - Log lib: Winston

## Running this project locally

 - 1 - Download/clone this project and create a .env file in root folder, having these variables:

```yaml
    DATA_PATH="data"
    DATA_LOCATION="data/accounts.json"
    PORT=8080
```

 - 2 - Open a terminal in project´s root folder and run the following commands:

- ```$ npm install```
- ```$ npm install -g nodemon``` (if nodemon isn´t installed)
- ```$ nodemon server```

Now API can be consumed in **localhost:8080**

## Consuming the API

You can test this API by browsing the Swagger documentation provided here. If you prefer, you can also
create requests to API endpoints by using applications like Insomnia or Postman. Here is the list of
http verbs followed by the available endpoints:

- ```GET /account``` - Fetches all accounts
- ```GET /account/{accountId}``` - Fetches an account by Id
- ```POST /account``` - Creates a new account
- ```PUT /account``` - Updates an account entirely
- ```DELETE /account/{accountId}``` - Deletes an account
- ```PATCH /account/balance/{accountId}``` - Updates an account´s balance

## Key Features

 - Data persistence in .json with Node I/O operations
 - An index.html bringing some API data info
 - All actions captured into daily logs
 - Every endpoint is fully documented with Swagger

