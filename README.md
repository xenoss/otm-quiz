This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Requirements

- Node.js 8.x


# Installation

`npm i`

# Local run

`npm run`

# Deployment

- Make sure you have credentials installed.

`npm run deploy`

- To upload questions from data folder and create test user (check admin credentials installed)

`node utils/importer.js`


## Credentials
- Admin (deployment access)
`go https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk
and get key, put key here with name privatekey.json`

- Replace src/config.js content

## Pretty code

`npm run check`


## Testing

### Unit

`npm test`

or for CI

`CI=1 npm test`

### Functional
```
selenium-standalone install
selenium-standalone start
```
and run tests

`codeceptjs run`

## Technical notes
- No reasons for redux yet.

