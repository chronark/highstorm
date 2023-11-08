<div align="center">
 <h1 align="center">Sadly I don't have the time to maintain this project. I'm building <a href="https://unkey.dev?utm_source=highstorm">unkey.dev</a> to solve API authentication and authorization with DX in mind. It's also <a href="https://github.com/unkeyed/unkey">100% open source</a>!
</h1>
</div>
<br/><br/><br/>
<div align="center">
    <h1 align="center">Highstorm</h1>
    <h5>Open Source Event Monitoring</h5>
</div>

<div align="center">
  <a href="https://highstorm.app?ref=github">highstorm.app</a>
</div>
<br/>

## Contributing

Thank you for considering contributing to our open source project! We appreciate your interest and are excited to have you on board. This document outlines the steps you need to follow to contribute to the project effectively. Please read the guidelines carefully and feel free to reach out if you have any questions.

### Services

Before getting started, please ensure that you have the following third-party services set up:

- [planetscale](https://planetscale.com?ref=highstorm): Database
- [tinybird](https://www.tinybird.co?ref=highstorm): Time series database
- [upstash](https://upstash.com/qstash?ref=highstorm): Optional, only required for reports
- [clerk](https://clerk.com?ref=highstorm): Authentication

## Installation

To install the project and its dependencies, follow these steps:

1.  Ensure you have `pnpm` installed on your system. If not, you can install it by running:

    ```sh-session
    npm install -g pnpm
    ```

2.  Run the following command to install the project dependencies:
    ```sh-session
    pnpm install
    ```

### Environment Variables

After setting up the required services, you need to set the corresponding environment variables in the `/apps/web/.env` file. To do this, follow these steps:

1.  Make a copy of the `.env.example` file:
    ```sh-session
    cp apps/web/.env.example apps/web/.env
    ```
2.  Open the `/apps/web/.env` file in a text editor and populate the values for the services mentioned above.

## Database Preparation

### Prisma

To prepare the Prisma database, follow these steps:

1.  Navigate to the `/apps/web` directory:
    ```sh-session
    cd apps/web
    ```
2.  Run the following command to push the database schema and generate Prisma Client:
    ```sh-session
    npx prisma db push
    ```

### Tinybird

To prepare the Tinybird database, follow these steps:

1.  Download the Tinybird CLI from [here](https://www.tinybird.co/docs/cli.html) and install it on your system.
2.  After authenticating with the Tinybird CLI, navigate to the `/apps/web/lib/tinybird` directory:
    ```sh-session
    cd apps/web/lib/tinybird
    ```
3.  Push the necessary datasources using the following command:
    ```sh-session
    tb push datasources/
    tb push
    ```

**Note: If the CLERK_WEBHOOK_SECRET env variable is not set, pass an empty string, and make sure to visit `/onboarding` after signing up.**

## Build

To build the project, execute the following command:

```sh-session
pnpm build
```

## Run

To run the project locally, use the following command:

```sh-session
pnpm turbo run dev --filter=web
```
