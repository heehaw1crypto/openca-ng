# amzr_risk-assessment-service

## Requirements

- Node.js >= 8.5.0
- MySQL 5.7

## Setup

```sh
npm install
```

## Run

The following environment variables are required to be set:

- DB_USER
- DB_PASSWORD
- TOKEN_SECRET

```sh
npm start
```

### Watch Mode

```sh
npm run start:watch
```

## Tests

This project uses [Mocha](https://mochajs.org/) for testing.

### Run

The following environment variables are required to be set:

- DB_USER
- DB_PASSWORD
- TOKEN_SECRET
- SERVICE_BASE_URL

Ensure that the service is running. Then:

```sh
npm test
```

Note: this _will_ modify the data in your tables.

## Adding Custom Routes

Custom routes can be added fairly painlessly, but some conventions must be followed.

- Routes **must** be defined in `custom/router.js`
- Each route definition **must** have an `apiDoc` annotation with at least the following params:
  - [api](http://apidocjs.com/#param-api)
  - [apiName](http://apidocjs.com/#param-api-name). The name **must** be unique. Used to tie a route to its JSON schemas.
- JSON schemas **must** be placed in `custom/schemas`, and **must** follow the following naming convention:
  - HTTP 2XX Response Body (required) - `[apiName].res.body.2XX.json`
    - For a route that sends a 204 status code, unfortunately, it's necessary at this time to create a placeholder `[apiName].res.body.204.json`. The contents of the file are ignored; it's okay for the file to be empty.
  - HTTP 4XX|5XX Response Body (optional) - `[apiName].res.body.XXX.json`
  - Request Body (optional) - `[apiName].req.body.json`
  - Request Path Parameters (optional) - `[apiName].req.params.json`
  - Request Query Parameters (optional) - `[apiName].req.query.json`
  - Request Headers (optional) - `[apiName].req.headers.json`
- Tests (if any) **should** be added to `test/routes.custom.test.js`

After you are done writing the custom routes, run `node updateService.js` to "register" the custom routes, i.e., include them in the OpenAPI doc, JS SDK, etc.

Any changes to `package.json`, e.g., due to an added dependency, will not be overwritten.

### Notes

- Custom routes take precedence over generated ones.
- To help avoid problems with misnamed JSON schema files, the generator logs the file name it expects and whether it found a match.
- For each route, you should define as many JSON schemas possible, in order for the route definition to be accurate and complete in the generated OpenAPI doc. At the very least, if a route has required input, e.g., it requires a request body, you should create a JSON schema for it. Otherwise, things like the JS SDK won't work as expected.
