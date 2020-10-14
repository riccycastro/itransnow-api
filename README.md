# iTranslateNow API
It's an API that allows you to manage all your web platform translations. Given a translation key and a language code, you can have the translation text from the provided language. It allows you to organize your translations by sections, and it supports white label.

[Nest](https://github.com/nestjs/nest) framework TypeScript

_Note:_ Currently at an early stage of development, use at your own risk. We do not guarantee sudden changes in the implementation.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Commands
[nestjs-command](https://gitlab.com/aa900031/nestjs-command)

For development purpose you may need to create some fake translations, you can use 
the following command to generate fake translation keys and translations

```bash
$ npx nestjs-command translation:populate
```

_Note:_ You need to register CLI_PATH=./dist/src/cli.js as a env var

## Env Vars
    NODE_ENV: # dev | prod | staging
    SECRET: # your application secret
    PORT: # the port your application will listen
    HASH_SALT: # your hash salt, it can be a string or number
    HASH_EXPIRES_IN: # jwt expiration time: 7d(seven days) | 10h(ten days) | 60s(sixty seconds) | 11(eleven milliseconds)
    SYSTEM_PASSWORD: # your system password, this value is used during the migration to create the system user. you can remove it after that
    CLI_PATH: ./dist/src/cli.js # it MUST be this value

## License

  iTranslateNow is [MIT licensed](https://github.com/riccycastro/itransnow-api/blob/master/LICENSE).
  

## todo
* Integration tests
* Add database cache
* Add a config layer
* Language teams CRUD
