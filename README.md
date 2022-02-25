# Shoppy

This is a [Next.js](https://nextjs.org/) project that renders a React frontend with some API routes to handle CRUD actions for managing a shopping list.

The data is persisted in an SQLite database. Prisma is used as the ORM to handle the database interaction.

## Getting Started

- Check out the repo
- Install dependencies:

  ```bash
  yarn install
  ```

- Define env variables. There is an example .env to get started

  ```bash
  cp .env.example .env
  ```

- Create the DB and run the migrations:

  ```bash
  yarn prisma migrate deploy
  ```

- Run the development server:

  ```bash
  yarn dev
  ```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Build for Production

Create a production build with:

```bash
yarn build
```

This can be run with

```bash
yarn start
```

## Usage

Add new items to the list by typing in the "Add a new item" input box and pressing enter.

Existing items can be checked off by clicking their respective checkbox. The item text can also be edited and all edits will be persisted as they're made.

## Tests

To run the tests run:

```bash
yarn test
```

This will load the test config, auto-migrate the testing database, and run the tests.

There is a mix of frontend tests that use `@testing-library/react` to interact with the DOM and API integration tests that run against the DB the item CRUD.

--

EE Version Number: `5b8d0fd276b6d288905ed2f63a934e057e8feca2`
